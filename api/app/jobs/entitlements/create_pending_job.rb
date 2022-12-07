# frozen_string_literal: true

module Entitlements
  # @see PendingEntitlements::CreateEntitlement
  class CreatePendingJob < ApplicationJob
    queue_as :default

    # @param [PendingEntitlement] pending_entitlement
    # @return [void]
    def perform(pending_entitlement)
      ManifoldApi::Container["pending_entitlements.create_entitlement"].(pending_entitlement)
    end
  end
end
