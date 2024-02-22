# frozen_string_literal: true

module SpamMitigation
  # @see SpamMitigation::Checker
  class Check
    # @return [Dry::Monads::Success({ Symbol => Dry::Monads::Result })]
    def call(...)
      SpamMitigation::Checker.new(...).call
    end
  end
end
