# frozen_string_literal: true

module Entitlements
  module Audit
    # Prepare each actionable {EntitlementGrantAudit} to be run
    # and then {Entitlements::Audit::Apply apply it}.
    class Perform
      include Dry::Monads[:do, :result]
      include ManifoldApi::Deps[
        apply_audit: "entitlements.audit.apply",
        refresh: "entitlements.refresh",
      ]

      # @return [Dry::Monads::Result]
      def call
        yield refresh.(sync: true)

        EntitlementGrantAudit.actionable.find_each do |audit|
          yield apply_audit.call audit
        end

        # Run once again
        yield refresh.(sync: false)

        Success()
      end
    end
  end
end
