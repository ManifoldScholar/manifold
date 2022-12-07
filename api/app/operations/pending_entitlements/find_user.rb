# frozen_string_literal: true

module PendingEntitlements
  class FindUser
    include Dry::Monads[:result, :validated, :do]

    prepend EntitlementImports::WithMessages

    # @param [PendingEntitlement] pending_entitlement
    # @return [Dry::Monads::Result]
    def call(pending_entitlement)
      return Success() if pending_entitlement.user.present?

      pending_entitlement.user = User.where(email: pending_entitlement.email).first

      pending_entitlement.save! if pending_entitlement.user_id_changed?

      if pending_entitlement.user.blank?
        log! "No user found for #{pending_entitlement.email}"

        Failure[:no_target_yet, pending_entitlement.email]
      else
        log! "Found user for #{pending_entitlement.email}"

        Success()
      end
    end
  end
end
