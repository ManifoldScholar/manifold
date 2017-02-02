require "digest"

module Ingestor
  module Strategy
    module Word
      module Inspector
        # Inspects a Word ingestion source
        class IngestionSource < ::Ingestor::Inspector::IngestionSourceInspector

          def initialize(ingestion_source_path, word_inspector)
            @ingestion_source_path = ingestion_source_path
            @word_inspector = word_inspector
          end

          def source_identifier
            Digest::MD5.hexdigest(@ingestion_source_path)
          end

          def source_path
            @word_inspector.relative_path(@ingestion_source_path)
          end

          def kind
            ::IngestionSource::KIND_PUBLICATION_RESOURCE
          end

          def attachment
            @word_inspector.get_source_file(@ingestion_source_path)
          end

        end
      end
    end
  end
end
