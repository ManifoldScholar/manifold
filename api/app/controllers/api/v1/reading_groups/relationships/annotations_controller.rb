module Api
  module V1
    module ReadingGroups
      module Relationships
        class AnnotationsController < ApplicationController

          before_action :set_reading_group
          authorize_actions_for :reading_group, all_actions: :read

          resourceful! Annotation do
            Annotation.filtered(
              with_pagination!(annotation_filter_params),
              scope: @reading_group.annotations.with_existing_text
            )
          end

          def index
            @annotations = load_annotations
            location = api_v1_reading_group_relationships_annotations_url(@reading_group.id)
            render_multiple_resources(
              @annotations,
              include: [:creator],
              location: location
            )
          end

          private

          def location; end

          def reading_group
            ReadingGroup.find(params[:reading_group_id])
          end

          def set_reading_group
            @reading_group = reading_group
          end

        end
      end
    end
  end
end
