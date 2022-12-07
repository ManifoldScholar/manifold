# frozen_string_literal: true

module Entitlements
  class Refresh
    include Dry::Monads[:do, :result, :try]
    include ManifoldApi::Deps[
      sync_static_models: "entitlements.sync_static_models",
      populate_grants: "entitlements.populate_grants",
    ]

    # @param [Boolean] sync
    def call(sync: true)
      yield sync_static_models.() if sync

      yield populate_grants.()

      yield refresh_grant_audits!

      Success()
    end

    private

    # @return [Dry::Monads::Result]
    def refresh_grant_audits!
      Try do
        EntitlementGrantAudit.refresh!
      end
    end
  end
end
