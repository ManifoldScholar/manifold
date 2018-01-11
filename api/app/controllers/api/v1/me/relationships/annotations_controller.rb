module Api
  module V1
    module Me
      module Relationships
        # Annotations controller
        class AnnotationsController < ApplicationController

          resourceful! Annotation do
            scope = Annotation.created_by(current_user)
            Annotation.filter(annotation_filter_params, scope: scope)
          end

          def index
            @annotations = load_annotations
            location = api_v1_me_relationships_annotations_url
            render_multiple_resources(
              @annotations,
              each_serializer: AnnotationSerializer,
              location: location,
              meta: meta(@annotations)
            )
          end

          private

          def meta(models)
            meta = build_meta_for models
            if params[:filter][:text]
              meta[:annotated] = Annotation.created_by(current_user)
                                           .by_text(params[:filter][:text])
                                           .exists?
            end
            meta
          end

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
