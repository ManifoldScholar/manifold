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
        render_multiple_resources @texts, include: INCLUDES
      end

      # GET /texts/1
      def show
        @text = scope_for_texts.includes(:project, :text_sections, :stylesheets)
                               .find(params[:id])
        includes = INCLUDES + %w(category creators contributors stylesheets)
        render_single_resource @text,
                               serializer: TextFullSerializer,
                               include: includes
      end

      def create
        @text = authorize_and_create_text(text_params)
        render_single_resource @text
      end

      def update
        @text = load_and_authorize_text
        includes = INCLUDES + %w(creators contributors)
        ::Updaters::Text.new(text_params).update(@text)
        render_single_resource @text,
                               serializer: TextFullSerializer,
                               include: includes
      end

      def destroy
        @text = load_and_authorize_text
        @text.destroy
      end

      protected

      def scope_for_texts
        Text.friendly
      end

    end
  end
end
