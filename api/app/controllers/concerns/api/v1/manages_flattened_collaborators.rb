module API
  module V1
    module ManagesFlattenedCollaborators
      extend ActiveSupport::Concern

      def collaborators_from_roles_params
        params.require(:data)
        maker = { data: [:type, :id] }
        param_config = { data: { roles: [], maker: maker } }
        params.permit(param_config)
      end

      # rubocop:disable Metrics/MethodLength
      def collaborators_from_roles(params, collaboratable_id, collaboratable_type)
        raw_params = params.to_unsafe_h

        roles = raw_params.dig(:data, :roles)
        maker = raw_params.dig(:data, :maker)

        roles.each_with_object([]) do |role, arr|
          collaborator_params = {
            data: {
              attributes: { role: role },
              relationships: {
                collaboratable: {
                  data: { id: collaboratable_id, type: collaboratable_type }
                },
                maker: maker
              }
            }
          }

          @collaborator = ::Updaters::Collaborator.new(collaborator_params).update(Collaborator.new)
          @collaborator.save
          arr << @collaborator
        end
      end
      # rubocop:enable Metrics/MethodLength

      def maker_param_present?
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
