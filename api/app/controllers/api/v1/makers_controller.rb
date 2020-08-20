module API
  module V1
    # makers controller
    class MakersController < ApplicationController

      resourceful! Maker, authorize_options: { except: [:index, :show] } do
        Maker.filtered(with_pagination!(maker_filter_params))
      end

      def index
        @makers = load_makers
        render_multiple_resources(
          @makers
        )
      end

      def show
        @maker = load_maker
        render_single_resource @maker
      end

      def create
        @maker = ::Updaters::Maker.new(maker_params).update(Maker.new)
        render_single_resource @maker
      end

      def update
        @maker = load_and_authorize_maker
        ::Updaters::Maker.new(maker_params).update(@maker)
        render_single_resource @maker
      end

      def destroy
        @maker = load_and_authorize_maker
        @maker.destroy
      end

    end
  end
end
