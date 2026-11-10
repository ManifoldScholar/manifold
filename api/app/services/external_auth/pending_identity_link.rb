# frozen_string_literal: true

module ExternalAuth
  # The parked IDP login held in cache while the user proves they own the existing account its email
  # matched. Built from an omniauth hash at divert time, found and consumed when the link is finalized.
  class PendingIdentityLink < CacheableStruct
    cache_ttl 15.minutes
    cache_key_prefix "external_auth/pending_identity_link"

    attribute :user_id, Types::String
    attribute :provider, Types::String
    attribute :email, Types::String.optional
    attribute :auth_hash, Types::Hash.constructor(&:to_h)

    def self.build(omniauth_hash, user)
      new(
        user_id: user.id,
        provider: omniauth_hash["provider"],
        email: omniauth_hash.info.email,
        auth_hash: omniauth_hash
      )
    end

    def auth_hash
      OmniAuth::AuthHash.new(attributes[:auth_hash])
    end

    def owned_by?(user)
      user_id == user.id
    end
  end
end
