module Api
  module V1
    # Texts controller
    class TextsController < ApplicationController

      INCLUDES = %w(project).freeze

      resourceful! Text, authorize_options: { except: [:index, :show] } do
        Text.all
      end

      # GET /texts
      def index
        @texts = load_texts
        render_multiple_resources(
          @texts,
          include: INCLUDES,
          each_serializer: TextPartialSerializer
        )
      end

      # GET /texts/1
      def show
        @text = load_text
        render_single_resource(@text, include: INCLUDES)
      end

      def create
        @text = authorize_and_create_text(text_params)
        render_single_resource @text
      end

      def update
        @text = load_and_authorize_text
        @text.update(text_params)
        render_single_resource(@text, include: INCLUDES)
      end

      def destroy
        @project.destroy
      end

    end
  end
end
