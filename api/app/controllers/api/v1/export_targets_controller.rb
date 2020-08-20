module API
  module V1
    class ExportTargetsController < ApplicationController
      resourceful! ExportTarget do
        ExportTarget.friendly.all
      end

      def index
        @export_targets = load_export_targets

        render_multiple_resources @export_targets
      end

      def show
        @export_target = load_and_authorize_export_target

        render_single_resource @export_target
      end

      def create
        @export_target = authorize_and_create_export_target export_target_params

        render_single_resource @export_target
      end

      def update
        @export_target = load_and_authorize_export_target

        ::Updaters::ExportTarget.new(export_target_params).update(@export_target)

        render_single_resource @export_target
      end

      def destroy
        @export_target = load_and_authorize_export_target

        @export_target.destroy

        head :no_content
      end
    end
  end
end
