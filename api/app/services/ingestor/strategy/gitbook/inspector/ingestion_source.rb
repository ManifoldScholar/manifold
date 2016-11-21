require "digest"

module Ingestor
  module Strategy
    module Gitbook
      module Inspector
        # Inspects a GitBook ingestion source
        class IngestionSource < ::Ingestor::Inspector::IngestionSourceInspector

          def initialize(ingestion_source_path, gitbook_inspector)
            @ingestion_source_path = ingestion_source_path
            @gitbook_inspector = gitbook_inspector
          end

          def source_identifier
            Digest::MD5.hexdigest(@ingestion_source_path)
          end

          def source_path
            @gitbook_inspector.relative_path(@ingestion_source_path)
          end

          def kind
            ::IngestionSource::KIND_PUBLICATION_RESOURCE
          end

          def attachment
            @gitbook_inspector.get_source_file(@ingestion_source_path)
          end

        end
      end
    end
  end
end
