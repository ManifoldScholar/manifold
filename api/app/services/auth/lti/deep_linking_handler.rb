# frozen_string_literal: true

module Auth
  module Lti
    # Orchestrates the controller-level deep linking response: caches the DL
    # context via {DeepLinkingContext#cache!}, maps validation errors to
    # categorized messages, and logs structured entries. Returns a {Result}
    # value object that the controller uses to redirect or render — no branching
    # logic lives in the controller.
    class DeepLinkingHandler
      Result = Data.define(:ok, :token, :message, :log_level)

      ERROR_MESSAGES = {
        DeepLinkingContext::InvalidRequestError => "Invalid request",
        DeepLinkingContext::DeploymentNotRegisteredError => "Deployment not registered"
      }.freeze
      GENERIC_ERROR_MESSAGE = "Session expired or unrecognized"

      # @param omniauth_hash [OmniAuth::AuthHash, Hash] request.env["omniauth.auth"]
      # @param user [User] the authenticated instructor
      def initialize(omniauth_hash, user)
        @omniauth_hash = omniauth_hash
        @user          = user
      end

      # @return [Result]
      def call
        token = DeepLinkingContext.new(omniauth_hash, user).cache!
        Result.new(ok: true, token: token, message: nil, log_level: nil)
      rescue DeepLinkingContext::Error => e
        message = ERROR_MESSAGES.fetch(e.class, GENERIC_ERROR_MESSAGE)
        log_warn(e)
        Result.new(ok: false, token: nil, message: message, log_level: :warn)
      rescue StandardError => e
        log_error(e)
        Result.new(ok: false, token: nil, message: GENERIC_ERROR_MESSAGE, log_level: :error)
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
    end
  end
end
