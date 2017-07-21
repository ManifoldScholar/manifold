module Api
  module V1
    module Me
      module Relationships
        # Annotations controller
        class AnnotationsController < ApplicationController
          resourceful! Annotation, authorize_options: { except: [:index] } do
            Annotation.filter(
              with_pagination!(annotation_filter_params),
              scope: @current_user.annotations
            )
          end

          def index
            @annotations = load_annotations
            location = api_v1_me_relationships_annotations_url(@current_user.id)
            render_multiple_resources(
              @annotations,
              each_serializer: AnnotationSerializer,
              include: [:creator, :text_section],
              location: location
            )
          end

          private

          def location
            api_v1_user_relationships_annotations_url(
              @annotation,
              user_id: @annotation.creator_id
            )
          end
        end
      end
    end
  end
end
