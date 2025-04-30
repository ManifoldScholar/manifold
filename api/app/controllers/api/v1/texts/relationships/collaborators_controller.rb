# frozen_string_literal: true

module API
  module V1
    module Texts
      module Relationships
        # Responds with collaborators for a text
        class CollaboratorsController < ApplicationController
          include API::V1::ManagesFlattenedCollaborators

          authority_actions create_from_roles: :create

          before_action :set_text

          resourceful! Collaborator, authorize_options: { except: [:index, :show] } do
            @text.collaborators.filtered(**collaborator_filter_params)
          end

          def index
            @collaborators = load_collaborators
            render_multiple_resources(
              @collaborators,
              include: %w(maker),
              location: api_v1_text_relationships_collaborators_url(@text)
            )
          end

          def show
            @collaborator = load_collaborator
            render_single_resource(@collaborator)
          end

          def create_from_roles
            @collaborators = collaborators_from_roles(collaborators_from_roles_params, @text.id, Text.name)
            render_multiple_resources(@collaborators, serializer: ::V1::CollaboratorSerializer)
          end

          def destroy
            return render_no_maker_error unless maker_param_present?

            @collaborators = load_collaborators
            @collaborators.destroy_all
          end

          private

          def set_text
            @text = Text.friendly.find(params[:text_id])
          end

          def load_collaborator
            @text.collaborators.find(params[:id])
          end
        end
      end
    end
  end
end
