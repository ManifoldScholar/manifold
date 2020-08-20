module API
  module V1
    # Events controller
    module Projects
      module Relationships
        # Responds with events in a project
        class EventsController < AbstractProjectChildController

          resourceful! Event, authorize_options: { except: [:index] } do
            Event.filtered(
              with_pagination!(event_filter_params),
              scope: @project.events.excluding_type([EventType[:comment_created],
                                                     EventType[:text_annotated]])
            )
          end

          def index
            @events = load_events
            render_multiple_resources(
              @events,
              location: api_v1_project_relationships_events_url(@project)
            )
          end

        end
      end
    end
  end
end
