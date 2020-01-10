module Api
  module V1
    module Me
      module Relationships
        # Annotations controller
        class AnnotationsController < ApplicationController

          before_action :authenticate_request!

          resourceful! Annotation do
            scope = Annotation.created_by(current_user)
            Annotation.filtered(annotation_filter_params, scope: scope)
          end

          def index
            @annotations = load_annotations
            location = api_v1_me_relationships_annotations_url
            render_multiple_resources(
              @annotations,
              include: [:creator],
              location: location,
              meta: meta
            )
          end

          private

          def meta
            return {} unless params[:filter][:text]

            {
              annotated: Annotation.created_by(current_user)
                .by_text(params[:filter][:text])
                .exists?
            }
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
