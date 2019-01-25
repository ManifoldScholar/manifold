module Api
  module V1
    module Projects
      module Relationships
        class CallToActionsController < ApplicationController

          before_action :set_project, only: [:index, :create]

          resourceful! CallToAction, authorize_options: { except: [:index] } do
            @project.call_to_actions
          end

          def index
            @call_to_actions = load_call_to_actions
            location = api_v1_project_relationships_call_to_actions_url(@project.id)
            render_multiple_resources @call_to_actions,
                                      location: location
          end

          def create
            @call_to_action = ::Updaters::Default.new(call_to_action_params)
                                                 .update(@project.call_to_actions.new)
            @call_to_action.save
            authorize_action_for @call_to_action

            location = api_v1_call_to_action_url(@call_to_action,
                                                 project_id: @project.id)

            render_single_resource @call_to_action,
                                   location: location
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
