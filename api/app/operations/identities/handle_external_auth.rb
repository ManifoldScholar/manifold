# frozen_string_literal: true

module Identities
  # Handle entitlements and user group memberships based on an external IDP's assertion
  class HandleExternalAuth
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      sync_managed_user_groups: "identities.sync_managed_user_groups",
      sync_managed_entitlements: "identities.sync_managed_entitlements"
    ]

    # @param [Identity] identity
    # @param [OmniAuth::Keystore] auth_hash
    # @return [Dry::Monads::Result]
    def call(identity, auth_hash)
      yield sync_managed_user_groups.(identity, auth_hash)

      yield sync_managed_entitlements.(identity, auth_hash)

      return Success()
    end
  end
end
