require "digest"

module Ingestor
  module Strategy
    module Gitbook
      module Inspector
        # Inspects Gitbook stylesheets
        class Stylesheet < ::Ingestor::Inspector::StylesheetInspector

          def initialize(stylesheet_path, gitbook_inspector)
            @stylesheet_path = stylesheet_path
            @gitbook_inspector = gitbook_inspector
          end

          def source_identifier
            "website.css"
          end

          def name
            "website.css"
          end

          def raw_styles
            IO.read(@stylesheet_path)
          end

          def ingestion_source(text)
            text.ingestion_sources.find_by(source_path: "styles/website.css")
          end

        end
      end
    end
  end
end
