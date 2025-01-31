module API
  module V1
    module Projects
      module Relationships
        # Responds with collaborators in a project
        class CollaboratorsController < AbstractProjectChildController

          resourceful! Collaborator, authorize_options: { except: [:index, :show] } do
            @project.collaborators.filtered(collaborator_filter_params)
          end

          def index
            @collaborators = load_collaborators
            render_multiple_resources(
              @collaborators,
              include: %w(maker),
              location: api_v1_project_relationships_collaborators_url(@project)
            )
          end

          def show
            @collaborator = load_collaborator
            render_single_resource(@collaborator)
          end

          def destroy
            return render_no_maker_error unless maker_filter_present?

            @collaborators = load_collaborators
            @collaborators.destroy_all
          end

          private

          def load_collaborator
            @project.collaborators.find(params[:id])
          end

          def maker_filter_present?
            maker_id = collaborator_filter_params[:maker]

            maker_id.present?
          end

          def render_no_maker_error
            message = "Maker filter is required"

            render json: { errors: [message] }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
