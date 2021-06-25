module TestHelpers
  module IngestionHelper
    def create_context(ingestion, logger = nil)
      Ingestions::Context.new(ingestion, logger)
    end
  end
end
