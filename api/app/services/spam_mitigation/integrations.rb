# frozen_string_literal: true

module SpamMitigation
  module Integrations
    extend ActiveSupport::Concern

    include Dry::Monads[:result]

    SPAM = :spam

    NOT_SPAM = :not_spam

    # @api private
    # @param [Boolean] check
    # @return [Dry::Monads::Result]
    def check_integration!(check)
      check.present? ? Success() : Failure[:integration_disabled]
    end
  end
end
