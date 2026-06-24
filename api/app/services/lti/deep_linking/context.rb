# frozen_string_literal: true

module Lti
  module DeepLinking
    # Encapsulates an LTI Deep Linking context — the bundle of deep linking
    # settings and contextual claims a launch produces — and is the sole
    # interface for reading and writing that context in Rails.cache.
    #
    # Build one from a launch with {.from_launch} and {#persist!} it to mint an
    # opaque token; load one back with {.find}; consume it (single use) with
    # {#consume!}. The launch auth hash is assumed already validated by
    # OmniAuth::Strategies::Lti — this object performs no JWT verification.
    class Context
      CACHE_TTL = 1.hour
      CACHE_KEY_PREFIX = "lti/dl"

      PAYLOAD_READERS = %w[
        user_id client_id iss deployment_id accept_multiple
        deep_link_return_url data lti_course_context_id
      ].freeze

      class Error < StandardError; end
      class InvalidRequestError < Error; end
      class IdempotencyError < Error; end
      class DeploymentNotRegisteredError < Error; end

      # Build a context from an LTI launch (write path).
      # @param omniauth_hash [OmniAuth::AuthHash, Hash] request.env["omniauth.auth"]
      # @param user [User] the authenticated instructor
      def self.from_launch(omniauth_hash, user)
        new(omniauth_hash: omniauth_hash, user: user)
      end

      # Load a previously persisted context (read path).
      # @param token [String] the opaque token returned by {#persist!}
      # @return [Context, nil] nil when the token is unknown or expired
      def self.find(token)
        payload = Rails.cache.read(cache_key(token))
        return if payload.blank?

        new(token: token, payload: payload)
      end

      # @return [String]
      def self.cache_key(token)
        "#{CACHE_KEY_PREFIX}/#{token}"
      end

      def initialize(omniauth_hash: nil, user: nil, token: nil, payload: nil)
        @omniauth_hash = omniauth_hash
        @user = user
        @token = token
        @payload = payload
      end
      private_class_method :new

      # Validate the launch, build the payload, write it to cache, and return
      # the minted token. Raises an {Error} subclass on validation failure, in
      # which case nothing is written.
      # @return [String] 64-character hex token
      def persist!
        raise IdempotencyError, "Context can only be persisted once" if token

        validate!
        @payload = build_payload
        @token = SecureRandom.hex(32)
        Rails.cache.write(self.class.cache_key(token), payload, expires_in: CACHE_TTL)
        token
      end

      # Delete the cached context (single-use consumption).
      # @return [void]
      def consume!
        Rails.cache.delete(self.class.cache_key(token))
      end

      attr_reader :token

      PAYLOAD_READERS.each do |field|
        define_method(field) { payload[field] }
      end

      def accept_types
        Array(payload["accept_types"])
      end

      # @param user [User]
      # @return [Boolean]
      def owned_by?(user)
        user_id == user.id
      end

      private

      attr_reader :omniauth_hash, :user

      def payload
        @payload ||= {}
      end

      def validate!
        raise InvalidRequestError, "Missing deep_link_return_url" if dl_settings["deep_link_return_url"].blank?
        raise DeploymentNotRegisteredError, "Deployment #{deployment_id_claim} is not registered" unless deployment
      end

      def build_payload
        {
          "data" => dl_settings["data"],
          "deep_link_return_url" => dl_settings["deep_link_return_url"],
          "accept_types" => dl_settings["accept_types"],
          "accept_multiple" => dl_settings["accept_multiple"],
          "deployment_id" => deployment_id_claim,
          "iss" => raw_info["iss"],
          "client_id" => raw_info["aud"],
          "lti_course_context_id" => course_context.id,
          "user_id" => user.id
        }
      end

      def lti_claims
        @lti_claims ||= omniauth_hash.dig("extra", "lti") || {}
      end

      def dl_settings
        @dl_settings ||= lti_claims["deep_linking_settings"] || {}
      end

      def context_claim
        @context_claim ||= lti_claims["context"] || {}
      end

      def deployment_id_claim
        lti_claims["deployment_id"]
      end

      def raw_info
        @raw_info ||= omniauth_hash.dig("extra", "raw_info") || {}
      end

      def registration
        @registration ||= LtiRegistration.find_by!(issuer: raw_info["iss"], client_id: raw_info["aud"])
      end

      def deployment
        return @deployment if defined?(@deployment)

        @deployment = LtiDeployment.find_by(lti_registration: registration, deployment_id: deployment_id_claim)
      end

      def course_context
        @course_context ||= LtiCourseContext.find_or_create_by!(
          lti_deployment: deployment,
          context_id: context_claim["id"]
        ) do |ctx|
          ctx.context_title = context_claim["title"]
          ctx.context_label = context_claim["label"]
          ctx.context_type  = Array(context_claim["type"]).first
        end
      rescue ActiveRecord::RecordNotUnique
        @course_context = LtiCourseContext.find_by!(lti_deployment: deployment, context_id: context_claim["id"])
      end
    end
  end
end
