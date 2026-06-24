# frozen_string_literal: true

module Lti
  module DeepLinking
    # Reads a deep linking context by token for the picker WITHOUT consuming it,
    # verifies the requesting user owns the session, and returns only the
    # selection constraints the picker needs to render. The token is consumed
    # later by {HandleSubmission}.
    #
    # Shares the expired/forbidden failure shapes with {HandleSubmission} via
    # {ContextErrors} so the client sees one error vocabulary across the GET
    # (lookup) and POST (submit) endpoints.
    class FetchContext
      include Dry::Monads[:result]
      include ContextErrors

      # @param token [String] the opaque token carried to the picker
      # @param user [User] current_user from the authenticated request
      def initialize(token, user)
        @token = token
        @user = user
      end

      # @return [Dry::Monads::Result] Success carries the picker constraints
      #   (accept_types, accept_multiple); Failure carries :status and a
      #   JSON:API-shaped :errors array.
      def call
        return expired_failure if context.nil?
        return forbidden_failure unless context.owned_by?(user)

        Success(accept_types: context.accept_types, accept_multiple: context.accept_multiple)
      end

      private

      attr_reader :token, :user

      def context
        @context ||= Context.find(token)
      end
    end
  end
end
