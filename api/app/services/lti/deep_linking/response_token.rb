# frozen_string_literal: true

module Lti
  module DeepLinking
    # Builds and signs the LTI 1.3 Deep Linking Response JWT that the browser
    # POSTs back to the platform's deep_link_return_url. Each selected resource
    # becomes an `ltiResourceLink` content item whose `url` the platform replays
    # as `target_link_uri` on the eventual resource link launch — the same
    # mechanism {Auth::OmniauthRedirect#target_path} already resolves.
    #
    # Signed RS256 with the Manifold tool key so the platform can verify it
    # against the tool's published JWKS (see {Auth::Jwks}).
    class ResponseToken
      MESSAGE_TYPE       = "LtiDeepLinkingResponse"
      LTI_VERSION        = "1.3.0"
      RESOURCE_LINK_TYPE = "ltiResourceLink"
      CLAIM_PREFIX       = "https://purl.imsglobal.org/spec/lti/claim"
      DL_CLAIM_PREFIX    = "https://purl.imsglobal.org/spec/lti-dl/claim"
      TOKEN_TTL          = 5.minutes

      # @param payload [Hash] the cached deep linking context (string keys)
      # @param selection [Array<Hash>] validated items carrying "url" and "title"
      def initialize(payload, selection)
        @payload = payload
        @selection = Array(selection)
      end

      # @return [String] the signed RS256 JWT
      def call
        JWT.encode(claims, private_key, "RS256", { kid: jwks.kid, typ: "JWT" })
      end

      private

      attr_reader :payload, :selection

      def claims
        now = Time.now.to_i
        {
          "iss"   => payload["client_id"],
          "aud"   => payload["iss"],
          "iat"   => now,
          "exp"   => now + TOKEN_TTL.to_i,
          "nonce" => SecureRandom.uuid,
          "#{CLAIM_PREFIX}/message_type"     => MESSAGE_TYPE,
          "#{CLAIM_PREFIX}/version"          => LTI_VERSION,
          "#{CLAIM_PREFIX}/deployment_id"    => payload["deployment_id"],
          "#{DL_CLAIM_PREFIX}/content_items" => content_items
        }.merge(data_claim)
      end

      def content_items
        selection.map do |item|
          {
            "type"  => RESOURCE_LINK_TYPE,
            "url"   => item["url"],
            "title" => item["title"]
          }.compact
        end
      end

      # The platform's opaque `data` must be echoed back verbatim when present.
      def data_claim
        return {} if payload["data"].blank?

        { "#{DL_CLAIM_PREFIX}/data" => payload["data"] }
      end

      def private_key
        Rails.application.config.manifold.private_key
      end

      def jwks
        @jwks ||= ::Auth::Jwks.new
      end
    end
  end
end
