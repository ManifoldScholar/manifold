module Api
  module V1
    # Annotations controller
    class AnnotationsController < ApplicationController
      before_action :set_annotation, only: [:show, :update, :destroy]
      before_action :set_text_section, only: [:create, :index]

      def index
        render json: @text_section.annotations
      end

      def create
        @annotation = @text_section.annotations.new(attributes_from(annotation_params))
        @annotation.user = @current_user
        if @annotation.save
          render json: @annotation, status: :created, location: [:api, :v1, @annotation]
        else
          render json: @annotation.errors.as_json(full_messages: true),
                 status: :unprocessable_entity
        end
      end

      private

      def set_text_section
        @text_section = TextSection.find(params[:text_section_id])
      end

      def set_annotation
        @annotation = Annotation.find(params[:id])
      end
    end
  end
end
