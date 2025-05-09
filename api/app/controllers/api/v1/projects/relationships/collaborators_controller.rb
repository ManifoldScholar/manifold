# frozen_string_literal: true

module API
  module V1
    module Projects
      module Relationships
        # Responds with collaborators in a project
        class CollaboratorsController < AbstractProjectChildController
          include API::V1::ManagesFlattenedCollaborators

          authority_actions create_from_roles: :create, update_from_roles: :update

          resourceful! Collaborator, authorize_options: { except: [:index, :show] } do
            @project.collaborators.filtered(**collaborator_filter_params)
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

          def create_from_roles
            @collaborators = collaborators_from_roles(collaboratable)
            render_multiple_resources(@collaborators, serializer: ::V1::CollaboratorSerializer)
          end

          def update_from_roles
            return render_no_maker_error unless maker_present?

            @current_collaborators = @project.collaborators.filtered({ maker: maker_id })

            @collaborators = adjust_collaborators_from_roles(@current_collaborators, collaboratable)
            render_multiple_resources(@collaborators, serializer: ::V1::CollaboratorSerializer)
          end

          def destroy
            return render_no_maker_error unless maker_present?

            @collaborators = load_collaborators
            @collaborators.destroy_all
          end

          private

          def load_collaborator
            @project.collaborators.find(params[:id])
          end

          def collaboratable
            { id: @project.id, type: Project.name }
          end
        end
      end
    end
  end
end
