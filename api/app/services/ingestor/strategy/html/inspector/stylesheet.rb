require "digest"

module Ingestor
  module Strategy
    module Html
      module Inspector
        # Inspects Word stylesheets
        class Stylesheet < ::Ingestor::Inspector::StylesheetInspector

          def initialize(style_chunk, _ingestion)
            @chunk = style_chunk
          end

          def source_identifier
            name
          end

          def name
            chunk[:name]
          end

          def raw_styles
            chunk[:styles]
          end

          def ingestion_source(text)
            text.ingestion_sources.find_by(source_path: @chunk[:path])
          end

          protected

          attr_reader :chunk

        end
      end
    end
  end
end
