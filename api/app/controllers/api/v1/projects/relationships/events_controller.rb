module Api
  module V1
    # Events controller
    module Projects
      module Relationships
        # Responds with events in a project
        class EventsController < ApplicationController
          before_action :set_project, only: [:index]

          resourceful! Event, authorize_options: { except: [:index] } do
            Event.filter(
              with_pagination!(event_filter_params),
              scope: @project.events.excluding_type([EventType[:comment_created],
                                                     EventType[:text_annotated]])
            )
          end

          def index
            @events = load_events
            render_multiple_resources(
              @events,
              each_serializer: EventSerializer,
              location: api_v1_project_relationships_events_url(@project)
            )
          end

          private

          def set_project
            @project = Project.friendly.find(params[:project_id])
          end
        end
      end
    end
  end
end
