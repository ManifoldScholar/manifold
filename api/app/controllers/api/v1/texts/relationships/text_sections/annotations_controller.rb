module API
  module V1
    module Texts
      module Relationships
        module TextSections
          # Annotations controller
          class AnnotationsController < ApplicationController
            before_action :set_text, only: [:index]
            before_action :set_text_section, only: [:index]

            config.pagination_enforced = true

            resourceful! Annotation do
              scope = @text_section.nil? ? Annotation.all : @text_section.annotations
              scope = scope.with_read_ability(current_user, exclude_public_annotations?)
              scope = scope.includes(:reading_group, :reading_group_membership, :text, :creator)
              Annotation.filtered(
                with_pagination!(annotation_filter_params),
                scope: scope
              )
            end

            def index
              @annotations = load_annotations
              location = api_v1_text_relationships_text_section_annotations_url(@text.id, @text_section.id)
              render_multiple_resources(
                @annotations,
                include: [:creator],
                location: location
              )
            end

            private

            def exclude_public_annotations?
              return false unless @text_section

              !@text_section.publicly_engageable_by?(authority_user)
            end

            def set_text
              @text = Text.friendly.find(params[:text_id])
            end

            def set_text_section
              @text_section = @text.text_sections.friendly.find(params[:text_section_id])
            end
          end
        end
      end
    end
  end
end
