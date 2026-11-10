# frozen_string_literal: true

module ExternalAuth
  module AuthAction
    extend ActiveSupport::Concern

    included do
      string :provider

      object :auth_hash, class: "OmniAuth::AuthHash", converter: :new

      validates :provider,
                inclusion: { in: ->(_) { AuthConfig.provider_names + %w[lti] } },
                presence: true

      delegate :info, to: :auth_hash, prefix: :auth
    end

    def account_linking_required?
      case provider.to_sym
      when :lti
        auth_hash.extra.lti_registration.require_account_linking?
      else
        AuthConfig.provider_for(provider)&.require_account_linking? || false
      end
    end
  end
end
