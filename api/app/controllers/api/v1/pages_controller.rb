module Api
  module V1
    # Pages controller
    class PagesController < ApplicationController

      resourceful! Page, authorize_options: { except: [:index, :show] } do
        Page.all
      end

      def index
        @pages = load_pages
        render_multiple_resources(@pages, each_serializer: PagePartialSerializer)
      end

      def show
        @scope_for_pages = Page.friendly
        @page = load_page
        render_single_resource(@page)
      end

      def create
        @page = authorize_and_create_project(page_params)
        render_single_resource(@page)
      end

      def update
        @page = load_and_authorize_page
        @page.update(page_params)
        render_single_resource(@page)
      end

      def destroy
        @page.destroy
      end
    end
  end
end
