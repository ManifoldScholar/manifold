# frozen_string_literal: true

module API
  module V1
    module ManagesFlattenedCollaborators
      extend ActiveSupport::Concern

      def collaborators_from_roles_params
        maker = [:type, :id]
        param_config = [{ roles: [], maker: maker }, :position]
        params.permit(param_config)
      end

      def collaborators_from_roles(collaboratable, attrs = collaborators_from_roles_params)
        roles = attrs[:roles]

        roles.each_with_object([]) do |role, arr|
          collaborator_params = {
            data: {
              attributes: { role: role, position: attrs[:position] },
              relationships: {
                collaboratable: { data: collaboratable },
                maker: { data: attrs[:maker] }
              }
            }
          }

          @collaborator = ::Updaters::Collaborator.new(collaborator_params).update(Collaborator.new)
          @collaborator.save
          arr << @collaborator
        end
      end

      def adjust_collaborators_from_roles(collaborators, collaboratable)
        next_roles = collaborators_from_roles_params[:roles]
        current_roles = collaborators.map { |c| c.role }

        collaborators.each do |c|
          unless next_roles.include?(c.role)
            c.destroy
          end
        end

        to_add = next_roles.reject { |r| current_roles.include?(r) }
        attrs = {
          roles: to_add,
          maker: collaborators_from_roles_params[:maker],
          position: collaborators_from_roles_params[:position]
        }

        collaborators_from_roles(collaboratable, attrs)
      end

      def maker_id
        collaborator_filter_params[:maker] || collaborators_from_roles_params[:maker][:id]
      end

      def maker_present?
        maker_id.present?
      end

      def render_no_maker_error
        message = "Maker is required"

        render json: { errors: [message] }, status: :unprocessable_entity
      end
    end
  end
end
