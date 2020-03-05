module Entitlements
  module Audit
    # Prepare each actionable {EntitlementGrantAudit} to be run
    # and then {Entitlements::Audit::Apply apply it}.
    class Perform
      include Dry::Monads[:do, :result, :try]
      include ::Entitlements::Import[apply_audit: "audit.apply"]

      # @return [Dry::Monads::Result]
      def call
        yield sync_static_models!

        yield refresh_views!

        EntitlementGrantAudit.actionable.find_each do |audit|
          yield apply_audit.call audit
        end

        # Run once again
        yield refresh_views!

        Success(true)
      end

      private

      def refresh_views!
        Try do
          EntitlementGrant.refresh!

          EntitlementGrantAudit.refresh!
        end.to_result
      end

      # @return [Dry::Monads::Result]
      def sync_static_models!
        Entitlements::SyncStaticModels.run_as_monad
      end
    end
  end
end
