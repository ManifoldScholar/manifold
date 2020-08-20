module API
  module V1
    module Projects
      module Relationships
        class ActionCalloutsController < AbstractProjectChildController

          resourceful! ActionCallout, authorize_options: { except: [:index] } do
            @project.action_callouts
          end

          def index
            @action_callouts = load_action_callouts
            location = api_v1_project_relationships_action_callouts_url(@project.id)
            render_multiple_resources @action_callouts,
                                      location: location
          end

          def create
            @action_callout =
              ::Updaters::ActionCallout.new(action_callout_params)
                .update(@project.action_callouts.new)
            @action_callout.save
            authorize_action_for @action_callout

            render_single_resource @action_callout,
                                   location: location
          end

          private

          def location
            return "" unless @action_callout.persisted?

            api_v1_action_callout_url(@action_callout, project_id: @project.id)
          end

        end
      end
    end
  end
end
