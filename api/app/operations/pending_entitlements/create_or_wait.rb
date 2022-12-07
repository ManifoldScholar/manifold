# frozen_string_literal: true

module PendingEntitlements
  # Called in an `after_create` hook, this operation will
  # either create the entitlement immediately or leave the
  # {PendingEntitlement} in the pending state to await the
  # creation of a user with a matching email.
  class CreateOrWait
    include Dry::Monads[:result, :validated, :do]
    include ManifoldApi::Deps[
      create_entitlement: "pending_entitlements.create_entitlement",
      find_user: "pending_entitlements.find_user",
    ]

    prepend EntitlementImports::WithMessages

    # @param [PendingEntitlement] pending_entitlement
    # @return [Dry::Monads::Result]
    def call(pending_entitlement)
      user_found = find_user.(pending_entitlement)

      Dry::Matcher::ResultMatcher.(user_found) do |m|
        m.success do
          create_entitlement.(pending_entitlement)
        end

        m.failure do
          wait_for pending_entitlement
        end
      end
    end

    private

    def wait_for(pending_entitlement)
      EntitlementMailer.pending(pending_entitlement).deliver_later

      Success()
    end
  end
end
