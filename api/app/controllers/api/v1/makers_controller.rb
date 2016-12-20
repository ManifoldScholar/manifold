module Api
  module V1
    # makers controller
    class MakersController < ApplicationController

      resourceful! Maker, authorize_options: { except: [:index, :show] } do
        Maker.filtered(maker_filter_params[:filter])
      end

      def index
        @makers = load_makers
        render_multiple_resources(
          @makers,
          each_serializer: MakerSerializer
        )
      end

      def show
        @maker = load_maker
        render_single_resource(@maker)
      end

      def create
        @maker = authorize_and_create_maker(maker_params)
        render_single_resource @maker
      end

      def update
        @maker = load_and_authorize_maker
        @maker.update(maker_params)
        render_single_resource(@maker)
      end

      def destroy
        @maker.destroy
      end

    end
  end
end
