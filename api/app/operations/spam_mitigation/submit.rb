# frozen_string_literal: true

module SpamMitigation
  # @see SpamMitigation::Submiter
  class Submit
    # @return [Dry::Monads::Success({ Symbol => Dry::Monads::Result })]
    def call(...)
      SpamMitigation::Submitter.new(...).call
    end
  end
end
