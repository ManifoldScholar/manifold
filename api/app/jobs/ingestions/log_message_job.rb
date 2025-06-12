# frozen_string_literal: true

module Ingestions
  class LogMessageJob < AsyncApplicationJob
    def perform(ingestion_id:, kind:, payload:)
      IngestionMessage.create!(ingestion_id:, kind:, payload:)
    end
  end
end
