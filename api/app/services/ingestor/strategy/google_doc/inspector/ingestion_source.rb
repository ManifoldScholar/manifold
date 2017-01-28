require "digest"

module Ingestor
  module Strategy
    module GoogleDoc
      module Inspector
        # Inspects a Word ingestion source
        class IngestionSource < ::Ingestor::Inspector::IngestionSourceInspector

          include ::Ingestor::Inspector::HTML::IngestionSource

        end
      end
    end
  end
end
