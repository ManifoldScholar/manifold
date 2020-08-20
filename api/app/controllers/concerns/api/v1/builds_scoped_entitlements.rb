module API
  module V1
    module BuildsScopedEntitlements
      extend ActiveSupport::Concern

      INCLUDES = %i[entitler target subject].freeze

      # @param [Concerns::Entitleable] subject
      # @param [Entitler] entitler
      # @param [Boolean] authorize
      # @return [Entitlement]
      def build_entitlement_for(subject, entitler: build_entitler_for(subject), authorize: true)
        Entitlement.new(entitler: entitler, subject: subject).tap do |entitlement|
          authorize_action_for entitlement if authorize
        end
      end

      # @return [Entitler]
      def build_entitler_for(_subject)
        Entitler.by_entity(current_user).upsert!({})
      end

      def scoped_entitlement_params
        params.require(:data)

        attributes = [
          :target_url,
          :expiration,
          { global_roles: %i[subscriber],
            scoped_roles: %i[read_access] }
        ]

        param_config = structure_params(attributes: attributes)

        params.permit(param_config)
      end

      def scoped_entitlement_inputs_for(entitlement)
        entitlement_params.require(:data).require(:attributes).to_h.merge(entitlement: entitlement)
      end
    end
  end
end
