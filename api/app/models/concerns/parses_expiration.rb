# frozen_string_literal: true

# A concern that sets `expires_on` from a potentially human-readable, optional
# field called `expiration`.
#
# @see Entitlements::ParseExpiration
module ParsesExpiration
  extend ActiveSupport::Concern

  # @return [void]
  def parse_expiration!
    parsed = ManifoldApi::Container["entitlements.parse_expiration"].(expiration)

    Dry::Matcher::ResultMatcher.(parsed) do |m|
      m.success do |expires_on|
        self.expires_on = expires_on
      end

      m.failure :past do
        errors.add :expiration, "must be in the future"
      end

      m.failure do
        errors.add :expiration, "did not produce a valid date"
      end
    end
  end
end
