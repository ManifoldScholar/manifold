module Api
  module V1
    # Sections controller
    class TextSectionsController < ApplicationController
      before_action :set_section, only: [:show, :update, :destroy]

      # GET /text_sections/1
      def show
        render json: @text_section
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_section
        @text_section = TextSection.find(params[:id])
      end

    end
  end
end
