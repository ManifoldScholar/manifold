module ExportStrategies
  # Shared haltable concern for export strategies that ensures the result
  # returns a monadic response
  module Haltable
    extend ActiveSupport::Concern

    include Dry::Monads::Result::Mixin

    # @return [Dry::Monads::Result]
    def haltable!
      raise "Must provide a block" unless block_given?

      result = catch :halt! do
        yield
      end

      # Ensure we return a monad
      Types::MONADIC_RESULT[result]
    end

    # Halt execution with an optional reason or monad
    #
    # @see #haltable!
    # @param [String, Dry::Monads::Result] reason
    # @return [void]
    def halt!(reason = nil, code: :halted)
      reason = reason.is_a?(Dry::Monads::Result) ? reason : Failure([code, reason.presence || "Halted!"])

      throw :halt!, reason
    end
  end
end
