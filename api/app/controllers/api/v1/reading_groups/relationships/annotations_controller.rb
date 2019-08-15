module Api
  module V1
    module ReadingGroups
      module Relationships
        class AnnotationsController < ApplicationController

          before_action :set_reading_group

          resourceful! Annotation do
            Annotation.filter(
              with_pagination!(annotation_filter_params),
              scope: @reading_group.annotations
            )
          end

          def index
            @annotations = load_annotations
            location = api_v1_reading_group_relationships_annotations_url(@reading_group.id)
            render_multiple_resources(
              @annotations,
              each_serializer: AnnotationSerializer,
              include: [:creator, :text_section],
              location: location
            )
          end

          private

          def location
          end

          def set_reading_group
            @reading_group = ReadingGroup.find(params[:reading_group_id])
          end

        end
      end
    end
  end
end
