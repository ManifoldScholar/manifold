require "digest"

module Ingestor
  module Inspector
    module HTML
      # Inspects HTML stylesheets
      module Stylesheet
        def initialize(stylesheet, html_inspector)
          @stylesheet = stylesheet
          @html_inspector = html_inspector
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
