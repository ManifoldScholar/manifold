# frozen_string_literal: true

module Lti
  # Wraps a validated OmniAuth LTI auth hash and centralizes the LTI claim
  # vocabulary plus the trust-chain resolution shared by the deep-linking and
  # resource-link flows. Resolves the registration and deployment but never
  # creates them — deployment creation is the strategy's single responsibility
  # (see {OmniAuth::Strategies::Lti#verify_deployment!}).
  class Launch
    # @param omniauth_hash [OmniAuth::AuthHash, Hash] request.env["omniauth.auth"]
    def initialize(omniauth_hash)
      @omniauth_hash = omniauth_hash
    end

    def issuer
      raw_info["iss"]
    end

    def client_id
      raw_info["aud"]
    end

    def deployment_id
      lti_claims["deployment_id"]
    end

    def message_type
      lti_claims["message_type"]
    end

    def roles
      lti_claims["roles"]
    end

    def target_link_uri
      omniauth_hash&.dig("extra", "target_link_uri")
    end

    def deep_linking_settings
      lti_claims["deep_linking_settings"] || {}
    end

    def context_id
      context_claim["id"]
    end

    def context_title
      context_claim["title"]
    end

    def context_label
      context_claim["label"]
    end

    def context_type
      Array(context_claim["type"]).first
    end

    # @return [LtiRegistration, nil]
    def registration
      return @registration if defined?(@registration)

      @registration = LtiRegistration.find_by(issuer: issuer, client_id: client_id)
    end

    # @return [LtiDeployment, nil] found only — created by the strategy on launch
    def deployment
      return @deployment if defined?(@deployment)

      @deployment = registration && LtiDeployment.find_by(lti_registration: registration, deployment_id: deployment_id)
    end

    private

    attr_reader :omniauth_hash

    def lti_claims
      @lti_claims ||= omniauth_hash&.dig("extra", "lti") || {}
    end

    def raw_info
      @raw_info ||= omniauth_hash&.dig("extra", "raw_info") || {}
    end

    def context_claim
      @context_claim ||= lti_claims["context"] || {}
    end
  end
end
