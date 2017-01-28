require "digest"

module Ingestor
  module Inspector
    module HTML
      # Inspects an HTML ingestion source
      module IngestionSource
        def initialize(ingestion_source_path, html_inspector)
          @ingestion_source_path = ingestion_source_path
          @html_inspector = html_inspector
          @basename = @html_inspector.basename
        end

        def source_identifier
          Digest::MD5.hexdigest(@ingestion_source_path)
        end

        def source_path
          @html_inspector.relative_path(@ingestion_source_path)
        end

        def kind
          return ::IngestionSource::KIND_SECTION if
            File.basename(@ingestion_source_path) == "#{@basename}.html"
          ::IngestionSource::KIND_PUBLICATION_RESOURCE
        end

        def attachment
          @html_inspector.get_source_file(@ingestion_source_path)
        end
      end
    end
  end
end
