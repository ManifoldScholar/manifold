module API
  module V1
    class CollaboratorsController < ApplicationController

      authority_actions create_from_roles: "create"

      resourceful! Collaborator, authorize_options: { except: [:roles] } do
        Collaborator.filtered(collaborator_filter_params)
      end

      def create_from_roles
        @collaborators = collaborators_from_roles(collaborators_from_roles_params)
        render_multiple_resources(@collaborators, serializer: ::V1::CollaboratorSerializer)
      end

      def roles
        role_list = CollaboratorRole.map { |r| r.to_s }

        render json: { data: role_list }
      end

      private

      def collaborators_from_roles_params
        params.require(:data)
        attributes = { roles: [] }
        relationships = {
          maker: { data: [:type, :id] },
          collaboratable: { data: [:type, :id] }
        }
        param_config = { data: { attributes: attributes, relationships: relationships } }

        params.permit(param_config)
      end

      def collaborators_from_roles(params)
        raw_params = params.to_unsafe_h

        roles = raw_params.dig(:data, :attributes, :roles)
        relationships = raw_params.dig(:data, :relationships)

        roles.each_with_object([]) do |role, arr|
          collaborator_params = {
            data: {
              attributes: { role: role },
              relationships: relationships
            }
          }
          @collaborator = ::Updaters::Collaborator.new(collaborator_params).update(Collaborator.new)
          @collaborator.save
          arr << @collaborator
        end
      end

    end
  end
end
