module API
  module V1
    # categories controller
    class CategoriesController < ApplicationController

      resourceful! Category, authorize_options: { except: [:index, :show] } do
        Category.all
      end

      def index
        @categories = load_categories
        render_multiple_resources(
          @categories
        )
      end

      def show
        @category = load_category
        render_single_resource(@category)
      end

      def update
        @category = load_and_authorize_category
        ::Updaters::Default.new(category_params).update(@category)
        render_single_resource(@category)
      end

      def destroy
        @category = load_and_authorize_category
        @category.destroy
      end

    end
  end
end
