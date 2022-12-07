# frozen_string_literal: true

module EntitlementImportRows
  class Contract < Entitlements::AbstractContract
    include ManifoldApi::Deps[
      parse_expiration: "entitlements.parse_expiration"
    ]

    params do
      required(:subject).value(Entitlements::Types::ImportSubject)
      optional(:target).maybe(Entitlements::Types::ImportTarget)
      optional(:email).maybe(:string) { email? }

      optional(:expires_on).maybe(:date)
      optional(:expiration).maybe(:string)
      optional(:first_name).maybe(:string)
      optional(:last_name).maybe(:string)
    end

    rule do
      next if values[:target].present? || values[:email].present?

      base.failure("You must provide an email to entitle")
    end

    rule do
      next unless values[:expires_on].present? && values[:expiration].present?

      base.failure("You cannot provide both expires_on and expiration on the same row")
    end

    rule(:subject).validate(:existing_global_id)
    rule(:target).validate(:existing_global_id)

    rule(:expiration) do
      next if base_rule_error? || value.blank? || values[:expires_on].present?

      parsed = parse_expiration.(value)

      Dry::Matcher::ResultMatcher.(parsed) do |m|
        m.success do |expires_on|
          values[:expires_on] = expires_on
        end

        m.failure :past do
          key.failure "must be in the future"
        end

        m.failure do
          key.failure "did not produce a valid date"
        end
      end
    end
  end
end
