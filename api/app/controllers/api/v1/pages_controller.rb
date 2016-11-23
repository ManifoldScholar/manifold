module Api
  module V1
    # Pages controller
    class PagesController < ApplicationController

      authorize_actions_for Page, except: [:index, :show]
      before_action :set_page, only: [:show, :update, :destroy]

      # GET /pages
      def index
        @pages = Page.all
        render json: @pages,
               each_serializer: PagePartialSerializer
      end

      # GET /pages/1
      def show
        render json: @page, include: %w(category creators contributors stylesheets)
      end

      # POST /pages
      def create
        @page = Page.new(page_params)
        if @page.save
          render json: @page, status: :created, location: [:api, :v1, @page]
        else
          render json: @page.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /pages/1
      def update
        if @page.update(page_params)
          render json: @page
        else
          render json: @page.errors, status: :unprocessable_entity
        end
      end

      # DELETE /pages/1
      def destroy
        @page.destroy
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_page
        @page = Page.friendly.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def page_params
        params.require(:page).permit
      end
    end
  end
end
