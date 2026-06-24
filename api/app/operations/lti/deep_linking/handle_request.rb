# frozen_string_literal: true

module Lti
  module DeepLinking
    # Orchestrates the controller-level deep linking response: persists the DL
    # context via {Context#persist!}, maps validation errors to categorized
    # messages, and logs structured entries. Returns a {Dry::Monads::Result}
    # the controller uses to redirect or render — no branching logic lives in
    # the controller.
    class HandleRequest
      include Dry::Monads[:result]

      ERROR_MESSAGES = {
        Context::InvalidRequestError => "Invalid request",
        Context::DeploymentNotRegisteredError => "Deployment not registered"
      }.freeze
      GENERIC_ERROR_MESSAGE = "Session expired or unrecognized"

      # @param omniauth_hash [OmniAuth::AuthHash, Hash] request.env["omniauth.auth"]
      # @param user [User] the authenticated instructor
      def initialize(omniauth_hash, user)
        @omniauth_hash = omniauth_hash
        @user = user
      end

      # @return [Dry::Monads::Result] Success carries the opaque context token
      #   the picker exchanges for its constraints; Failure carries a categorized
      #   :message and the :status the controller renders the error template with.
      def call
        token = Context.from_launch(omniauth_hash, user).persist!
        Success(token:)
      rescue Context::Error => e
        log_warn(e)
        Failure(message: ERROR_MESSAGES.fetch(e.class, GENERIC_ERROR_MESSAGE), status: :bad_request)
      rescue StandardError => e
        log_error(e)
        Failure(message: GENERIC_ERROR_MESSAGE, status: :internal_server_error)
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
