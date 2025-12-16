# frozen_string_literal: true

module ExternalAuth
  module AuthAction
    extend ActiveSupport::Concern

    included do
      string :provider

      object :auth_hash, class: "OmniAuth::AuthHash", converter: :new

      validates :provider,
                inclusion: { in: ->(_) { (ManifoldEnv.oauth.known_strategies + SamlConfig.provider_names) } },
                presence: true

      delegate :info, to: :auth_hash, prefix: :auth
    end
  end
end
