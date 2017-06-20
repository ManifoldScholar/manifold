require "digest"

module Ingestor
  module Strategy
    module Markdown
      module Inspector
        # Inspects Markdown stylesheets
        class Stylesheet < ::Ingestor::Inspector::StylesheetInspector

          def initialize(stylesheet_path, ingestion)
            @stylesheet_path = stylesheet_path
            @ingestion = ingestion
          end

          def source_identifier
            "website.css"
          end

          def name
            "website.css"
          end

          def raw_styles
            @ingestion.read(@stylesheet_path)
          rescue Errno::ENOENT
            nil
          end

          def ingestion_source(text)
            text.ingestion_sources.find_by(source_path: "styles/website.css")
          end

        end
      end
    end
  end
end
