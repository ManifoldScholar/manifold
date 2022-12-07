# frozen_string_literal: true

module Entitlements
  # Support human-readable dates when incoming
  class ParseExpiration
    include Dry::Monads[:result, :do]

    CHRONIC_OPTIONS = {
      # When in doubt, dates should always be considered in the future
      context: :future,
      # We prefer MM/DD/YYYY dates if provided something ambiguous.
      # In general, people should use YYYY/MM/DD.
      endian_precedence: :middle
    }.freeze

    # @param [Date, String, Time] expiration
    # @return [Dry::Monads::Success(nil)]
    # @return [Dry::Monads::Success(Date)]
    # @return [Dry::Monads::Failure(:invalid)]
    # @return [Dry::Monads::Failure(:past)]
    def call(expiration)
      return Success(nil) if expiration.blank?

      parsed_date = yield parse expiration

      validate parsed_date
    end

    private

    def parse(input)
      case input
      when String
        options = CHRONIC_OPTIONS.merge(now: Time.current)

        Success Chronic.parse(input, options).try(:to_date)
      when ::Date then Success input
      when ::Time then Success input.to_date
      else
        Failure[:invalid]
      end
    end

    def validate(date)
      case date
      when Types::Date.constrained(gt: Date.current)
        Success date
      when Date
        Failure[:past]
      else
        Failure[:invalid]
      end
    end
  end
end
