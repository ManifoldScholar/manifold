require "digest"

module Ingestor
  module Strategy
    module Markdown
      module Inspector
        # Inspects a Markdown ingestion source
        class IngestionSource < ::Ingestor::Inspector::IngestionSourceInspector

          def initialize(ingestion_source_path, ingestion)
            @ingestion_source_path = ingestion_source_path
            @ingestion = ingestion
          end

          def source_identifier
            Digest::MD5.hexdigest(@ingestion_source_path)
          end

          def source_path
            @ingestion_source_path
          end

          def kind
            ::IngestionSource::KIND_PUBLICATION_RESOURCE
          end

          def attachment
            @ingestion.open(@ingestion_source_path)
          end

        end
      end
    end
  end
end
