module Api
  module V1
    module Me
      module Relationships
        # Annotations controller
        class AnnotationsController < ApplicationController

          resourceful! Annotation do
            scope = Annotation.created_by(current_user)
            Annotation.filter(
              with_pagination!(annotation_filter_params),
              scope: scope
            )
          end

          def index
            @annotations = load_annotations
            location = api_v1_me_relationships_annotations_url
            render_multiple_resources(
              @annotations,
              each_serializer: AnnotationSerializer,
              include: [:creator],
              location: location
            )
          end

          private

          def location
            api_v1_text_section_relationships_annotations_url(
              @annotation,
              text_section_id: @annotation.text_section_id
            )
          end

        end
      end
    end
  end
end
