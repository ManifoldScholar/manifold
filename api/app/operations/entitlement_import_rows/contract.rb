# frozen_string_literal: true

module EntitlementImportRows
  class Contract < Entitlements::AbstractContract
    params do
      required(:subject).value(Entitlements::Types::ImportSubject)
      optional(:target).maybe(Entitlements::Types::ImportTarget)
      optional(:email).maybe(:string) { email? }
      optional(:expires_on).maybe(:date)
    end

    rule do
      next if values[:target].present? || values[:email].present?

      base.failure("You must provide an email to entitle")
    end

    rule(:subject).validate(:existing_global_id)
    rule(:target).validate(:existing_global_id)
  end
end
