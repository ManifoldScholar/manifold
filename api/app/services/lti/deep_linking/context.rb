# frozen_string_literal: true

module Lti
  module DeepLinking
    # Extracts deep linking settings and contextual claims from a validated
    # OmniAuth LTI auth hash, finds-or-creates the LtiCourseContext for the
    # launch, and writes the full deep linking context to Rails.cache under
    # an opaque random token. The token is the only carrier the picker needs
    # to resolve back to the cached context.
    #
    # The auth hash is assumed to have already been validated by
    # OmniAuth::Strategies::Lti (signature, iss, aud, nonce, iat/exp,
    # deployment registration). This service performs NO further JWT
    # verification.
    class Context
      CACHE_TTL = 1.hour
      CACHE_KEY_PREFIX = "lti/dl"

      class Error < StandardError; end
      class InvalidRequestError < Error; end
      class IdempotencyError < Error; end
      class DeploymentNotRegisteredError < Error; end

      # @param omniauth_hash [OmniAuth::AuthHash, Hash] request.env["omniauth.auth"]
      # @param user [User] the authenticated instructor
      def initialize(omniauth_hash, user)
        @omniauth_hash = omniauth_hash
        @user = user
      end

      # Generates an opaque token, writes the DL context to Rails.cache,
      # and returns the token. Raises a subclass of {Error} on validation
      # failure; in that case nothing is written to the cache.
      #
      # @return [String] 64-character hex token
      def cache!
        validate!

        raise IdempotencyError, "Context can only be cached once" if defined?(@token)

        SecureRandom.hex(32).tap do |token|
          @token = token
          Rails.cache.write(cache_key(token), context_payload, expires_in: CACHE_TTL)
        end
      end

      private

      attr_reader :omniauth_hash, :user

      def validate!
        raise InvalidRequestError, "Missing deep_link_return_url" if dl_settings["deep_link_return_url"].blank?
        raise DeploymentNotRegisteredError, "Deployment #{deployment_id_claim} is not registered" unless deployment
      end

      def context_payload
        {
          data: dl_settings["data"],
          deep_link_return_url: dl_settings["deep_link_return_url"],
          accept_types: dl_settings["accept_types"],
          accept_multiple: dl_settings["accept_multiple"],
          deployment_id: deployment_id_claim,
          iss: raw_info["iss"],
          lti_course_context_id: course_context.id,
          user_id: user.id
        }
      end

      def cache_key(token)
        "#{CACHE_KEY_PREFIX}/#{token}"
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
        @registration ||= LtiRegistration.find_by!(
          issuer: raw_info["iss"],
          client_id: raw_info["aud"]
        )
      end

      def deployment
        return @deployment if defined?(@deployment)

        @deployment = LtiDeployment.find_by(
          lti_registration: registration,
          deployment_id: deployment_id_claim
        )
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
        @course_context = LtiCourseContext.find_by!(
          lti_deployment: deployment,
          context_id: context_claim["id"]
        )
      end
    end
  end
end
