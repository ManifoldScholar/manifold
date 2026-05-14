# frozen_string_literal: true

module Lti
  module DeepLinking
    # Orchestrates the controller-level deep linking response: caches the DL
    # context via {DeepLinkingContext#cache!}, maps validation errors to
    # categorized messages, and logs structured entries. Returns a {Result}
    # value object that the controller uses to redirect or render — no branching
    # logic lives in the controller.
    class RequestHandler
      include Dry::Monads[:result]

      ERROR_MESSAGES = {
        DeepLinkingContext::InvalidRequestError => "Invalid request",
        DeepLinkingContext::DeploymentNotRegisteredError => "Deployment not registered"
      }.freeze
      GENERIC_ERROR_MESSAGE = "Session expired or unrecognized"

      # @param omniauth_hash [OmniAuth::AuthHash, Hash] request.env["omniauth.auth"]
      # @param user [User] the authenticated instructor
      def initialize(omniauth_hash, user)
        @omniauth_hash = omniauth_hash
        @user = user
      end

      # @return [Dry::Monads::Result]
      def call
        token = Context.new(omniauth_hash, user).cache!
        Success(
          token:,
          accept_types: Array(dl_settings["accept_types"]),
          accept_multiple: dl_settings["accept_multiple"],
          deep_link_return_url: dl_settings["deep_link_return_url"]
        )
      rescue DeepLinkingContext::Error => e
        log_warn(e)
        Failure(message: ERROR_MESSAGES.fetch(e.class, GENERIC_ERROR_MESSAGE), log_level: :warn)
      rescue StandardError => e
        log_error(e)
        Failure(message: GENERIC_ERROR_MESSAGE, log_level: :error)
      end

      private

      attr_reader :omniauth_hash, :user

      def log_warn(error)
        Rails.logger.warn(
          "LTI deep linking validation failed: " \
          "deployment_id=#{deployment_id.inspect} " \
          "message_type=#{message_type.inspect} " \
          "failure_reason=#{error.class.name.demodulize} " \
          "message=#{error.message.inspect}"
        )
      end

      def log_error(error)
        Rails.logger.error(
          "LTI deep linking failed: " \
          "deployment_id=#{deployment_id.inspect} " \
          "message_type=#{message_type.inspect} " \
          "failure_reason=#{error.class.name} " \
          "message=#{error.message.inspect}"
        )
      end

      def deployment_id
        omniauth_hash&.dig("extra", "lti", "deployment_id")
      end

      def message_type
        omniauth_hash&.dig("extra", "lti", "message_type")
      end

      def dl_settings
        @dl_settings ||= omniauth_hash&.dig("extra", "lti", "deep_linking_settings") || {}
      end
    end
  end
end
