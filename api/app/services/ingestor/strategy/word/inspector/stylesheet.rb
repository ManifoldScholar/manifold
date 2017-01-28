require "digest"

module Ingestor
  module Strategy
    module Word
      module Inspector
        # Inspects Word stylesheets
        class Stylesheet < ::Ingestor::Inspector::StylesheetInspector

          def initialize(stylesheet, word_inspector)
            @stylesheet = stylesheet
            @word_inspector = word_inspector
          end

          def source_identifier
            "website.css"
          end

          def name
            "website.css"
          end

          def raw_styles
            @stylesheet
          end

          def ingestion_source(text)
            text.ingestion_sources.find_by(source_path: "styles/website.css")
          end

        end
      end
    end
  end
end
