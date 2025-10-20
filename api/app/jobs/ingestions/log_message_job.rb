# frozen_string_literal: true

module Ingestions
  class LogMessageJob < AsyncApplicationJob
    def perform(ingestion_id:, kind:, payload:, severity: "unknown")
      IngestionMessage.create!(ingestion_id:, kind:, payload:, severity:)
    end
  end
end
