# frozen_string_literal: true

module Lti
  module DeepLinking
    # Shared JSON:API failure shapes for deep linking services that resolve a
    # cached context by token. Including services must also include
    # Dry::Monads[:result] so the {Failure} builder is available.
    module ContextErrors
      private

      def expired_failure
        Failure(
          status: :unauthorized,
          errors: [JSONAPI::Helpers::Error.new(
            status: :unauthorized,
            title: "Context Expired",
            detail: "The deep linking session has expired. Please relaunch from your LMS."
          )]
        )
      end

      def forbidden_failure
        Failure(
          status: :forbidden,
          errors: [JSONAPI::Helpers::Error.new(
            status: :forbidden,
            title: "Unauthorized",
            detail: "You are not the instructor for this deep linking session."
          )]
        )
      end
    end
  end
end
