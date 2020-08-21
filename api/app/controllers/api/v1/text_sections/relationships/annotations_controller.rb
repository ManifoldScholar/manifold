module API
  module V1
    module TextSections
      module Relationships
        # Annotations controller
        class AnnotationsController < ApplicationController
          before_action :set_annotation, only: [:update, :destroy]
          before_action :set_text_section, only: [:create, :index]

          resourceful! Annotation, authorize_options: { except: [:index] } do
            scope = @text_section.nil? ? Annotation : @text_section.annotations
            scope = scope.with_read_ability(current_user, exclude_public_annotations?)
            scope = scope.includes(:reading_group, :text, :creator)
            Annotation.filtered(
              annotation_filter_params || {},
              scope: scope
            )
          end

          def index
            @annotations = load_annotations
            location = api_v1_text_section_relationships_annotations_url(@text_section.id)
            render_multiple_resources(
              @annotations,
              include: [:creator],
              location: location
            )
          end

          def create
            @annotation = ::Updaters::Default
              .new(annotation_params)
              .update_without_save(@text_section.annotations.new)
            @annotation.creator = @current_user
            authorize_action_for @annotation
            @annotation.save
            render_single_resource @annotation, location: location
          end

          def update
            @annotation = load_and_authorize_annotation
            ::Updaters::Default.new(annotation_params).update(@annotation)
            render_single_resource(
              @annotation,
              location: location
            )
          end

          def destroy
            @annotation = load_and_authorize_annotation
            @annotation.destroy
          end

          private

          def exclude_public_annotations?
            return false unless @text_section

            !@text_section.publicly_engageable_by?(authority_user)
          end

          def location
            api_v1_text_section_relationships_annotations_url(
              @annotation,
              text_section_id: @annotation.text_section_id
            )
          end

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
