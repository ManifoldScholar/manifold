module Entitlements
  class SyncStaticModels < ActiveInteraction::Base
    include MonadicInteraction

    isolatable!

    transactional!

    # @return [void]
    def execute
      RoleName.entitlements.each do |entitlement_role|
        EntitlementRole.upsert! name: entitlement_role
      end

      SystemEntitlementKind.known.each do |kind|
        SystemEntitlement.upsert! kind: kind
      end

      return true
    end
  end
end
