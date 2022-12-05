# frozen_string_literal: true

module EntitlementImports
  module WithMessages
    include Dry::Effects.State(:log_messages)

    class << self
      def prepended(base)
        base.include EntitlementImports::WritesMessages
        base.include ManifoldApi::Deps[
          capture_logs: "entitlement_imports.capture_logs",
        ]
      end
    end

    def call(loggable)
      capture_logs.(loggable) do
        super
      end
    end
  end
end
