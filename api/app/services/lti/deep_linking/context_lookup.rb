# frozen_string_literal: true

module Lti
  module DeepLinking
    # Resolves a deep linking context_token against Rails.cache for the picker
    # WITHOUT consuming it, verifies the requesting user owns the session, and
    # returns only the selection constraints the picker needs to render. The
    # token is consumed later by {Submission}.
    #
    # Shares the expired/forbidden failure shapes with {Submission} via
    # {ContextErrors} so the client sees one error vocabulary across the GET
    # (lookup) and POST (submit) endpoints.
    class ContextLookup
      include Dry::Monads[:result]
      include ContextErrors

      # @param context_token [String] the opaque token carried to the picker
      # @param user [User] current_user from the authenticated request
      def initialize(context_token, user)
        @context_token = context_token
        @user = user
      end

      # @return [Dry::Monads::Result] Success carries the picker constraints
      #   (accept_types, accept_multiple); Failure carries :status and a
      #   JSON:API-shaped :errors array.
      def call
        payload = Rails.cache.read(cache_key)
        return expired_failure if payload.blank?
        return forbidden_failure unless payload["user_id"] == user.id

        Success(
          accept_types: Array(payload["accept_types"]),
          accept_multiple: payload["accept_multiple"]
        )
      end

      private

      attr_reader :context_token, :user

      def cache_key
        "#{Context::CACHE_KEY_PREFIX}/#{context_token}"
      end
    end
  end
end
