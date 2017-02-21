module Api
  module V1
    # makers controller
    class MakersController < ApplicationController

      INCLUDES = %w(
        users
      ).freeze

      resourceful! Maker, authorize_options: { except: [:index, :show] } do
        Maker.filter(with_pagination!(maker_filter_params))
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
        render_single_resource(@maker, include: INCLUDES)
      end

      def create
        @maker = ::Updaters::Maker.new(maker_params).update(Maker.new)
        render_single_resource @maker
      end

      def update
        @maker = load_and_authorize_maker
        ::Updaters::Maker.new(maker_params).update(@maker)
        render_single_resource(@maker, include: INCLUDES)
      end

      def destroy
        @maker.destroy
      end

    end
  end
end
