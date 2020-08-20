module API
  module V1
    # Pages controller
    class PagesController < ApplicationController

      resourceful! Page, authorize_options: { except: [:index, :show] } do
        Page.all
      end

      def index
        @pages = load_pages
        render_multiple_resources @pages
      end

      def show
        @page = Page.friendly.find(params[:id])
        render_single_resource @page
      end

      def create
        @page = authorize_and_create_page(page_params)
        render_single_resource @page
      end

      def update
        @page = load_and_authorize_page
        ::Updaters::Page.new(page_params).update(@page)
        render_single_resource @page
      end

      def destroy
        @page = load_and_authorize_page
        @page.destroy
      end
    end
  end
end
