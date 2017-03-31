module ExternalAuth
  module AuthAction
    extend ActiveSupport::Concern

    included do
      string :provider

      object :auth_hash, class: "OmniAuth::AuthHash"

      validates :provider,
                inclusion: { in: ManifoldEnv.oauth.known_strategies },
                presence: true

      delegate :info, to: :auth_hash, prefix: :auth
    end
  end
end
