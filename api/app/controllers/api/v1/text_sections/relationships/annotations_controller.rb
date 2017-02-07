module Api
  module V1
    module TextSections
      module Relationships
        # Annotations controller
        class AnnotationsController < ApplicationController
          before_action :set_annotation, only: [:show, :update, :destroy]
          before_action :set_text_section, only: [:create, :index]

          resourceful! Annotation, authorize_options: { except: [:index] } do
            @text_section.annotations
          end

          def index
            render json: @text_section.annotations
          end

          def create
            @annotation = ::Updaters::Default
                          .new(annotation_params)
                          .update_without_save(@text_section.annotations.new)
            @annotation.creator = @current_user
            @annotation.save
            authorize_action_for @annotation
            location = api_v1_text_section_relationships_annotations_url(
              @annotation,
              text_section_id: @text_section.id
            )
            render_single_resource @annotation, location: location
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
  end
end
