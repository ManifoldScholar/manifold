# frozen_string_literal: true

module Entitlements
  # Populate various static models based on enums
  #
  # * {EntitlementRole} based on {RoleName} (specifically roles that are for entitlements)
  # * {SystemEntitlement} based on known {SystemEntitlementKind}.
  #
  # @see RoleName.entitlements
  # @see SystemEntitlementKind.known
  class SyncStaticModels
    include Dry::Monads[:result, :do, :try]

    # @return [Dry::Monads::Result]
    def call
      yield upsert_entitlement_roles!

      yield upsert_system_entitlements!

      Success()
    end

    private

    # @return [Dry::Mondas::Result]
    def upsert_entitlement_roles!
      Try do
        RoleName.entitlements.each do |entitlement_role|
          EntitlementRole.upsert! name: entitlement_role
        end
      end
    end

    # @return [Dry::Monads::Result]
    def upsert_system_entitlements!
      Try do
        SystemEntitlementKind.known.each do |kind|
          SystemEntitlement.upsert! kind: kind
        end
      end
    end
  end
end
