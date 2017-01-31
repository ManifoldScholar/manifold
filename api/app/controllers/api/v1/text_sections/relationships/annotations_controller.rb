module Api
  module V1
    module TextSections
      module Relationships
        # Annotations controller
        class AnnotationsController < ApplicationController
          before_action :set_annotation, only: [:show, :update, :destroy]
          before_action :set_text_section, only: [:create, :index]

          def index
            render json: @text_section.annotations
          end

          # rubocop:disable Metrics/AbcSize
          def create
            attributes = attributes_from(annotation_params)
            @annotation = @text_section.annotations.new(attributes)

            # TODO: remove this. It's only here for stubbing resource annotations.
            if @annotation.resource?
              @annotation.resource =
                @annotation.project.resources.order("RANDOM()").limit(1).first
            end

            @annotation.creator = @current_user
            if @annotation.save
              location = api_v1_text_section_relationships_annotations_url(@annotation)
              render json: @annotation, status: :created,
                     location: location
            else
              render json: @annotation.errors.as_json(full_messages: true),
                     status: :unprocessable_entity
            end
          end
          # rubocop:enableMetrics/AbcSize

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
