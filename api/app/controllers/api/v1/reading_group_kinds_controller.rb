module API
  module V1
    class ReadingGroupKindsController < ApplicationController
      resourceful! ReadingGroupKind do
        ReadingGroupKind.all
      end

      def index
        @kinds = load_reading_group_kinds

        render_multiple_resources @kinds, location: location_for(ReadingGroupKind)
      end

      def show
        @kind = load_and_authorize_reading_group_kind

        render_single_resource @kind, location: location_for(@kind)
      end

      def create
        @kind = authorize_and_create_reading_group_kind reading_group_kind_params

        render_single_resource @kind, location: location_for(@kind)
      end

      def update
        @kind = load_and_authorize_reading_group_category

        ::Updaters::Default.new(reading_group_kind_params).update(@kind)

        render_single_resource @kind, location: location_for(@kind)
      end

      def destroy
        @kind = load_and_authorize_reading_group_category

        if @kind.destroy
          head :no_content
        else
          render_single_resource @kind, location: location_for(@kind)
        end
      end

      private

      def location_for(kind = @kind)
        target = kind || ReadingGroupKind

        url_for([:api, :v1, target])
      end

      def reading_group_kind_params
        attributes = [:name]

        param_config = structure_params(attributes: attributes)

        params.require(:data).permit(param_config)
      end
    end
  end
end
