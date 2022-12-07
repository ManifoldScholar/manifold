# frozen_string_literal: true

module Entitlements
  module Audit
    # Apply an {EntitlementGrantAudit} based on its {EntitlementAuditAction}.
    class Apply
      include Dry::Monads[:result]
      include ::Import[
        add_role: "roles.add",
        remove_role: "roles.remove",
      ]

      # @param [EntitlementGrantAudit] audit
      # @return [Dry::Monads::Result]
      def call(audit)
        case audit.action
        when EntitlementAuditAction[:add_role]
          user, role_name, resource = audit.to_role_tuple

          add_role.call user, role_name, resource
        when EntitlementAuditAction[:remove_role]
          user, role_name, resource = audit.to_role_tuple

          remove_role.call user, role_name, resource
        else
          # :nocov:
          Failure[:invalid_action, "could not apply `#{audit.action}` action"]
          # :nocov:
        end
      end
    end
  end
end
