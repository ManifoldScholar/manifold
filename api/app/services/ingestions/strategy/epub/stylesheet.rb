module Ingestions
  module Strategy
    module Epub
      # Inspects epub for a single stylesheet
      class Stylesheet

        def initialize(stylesheet_node, epub_inspector)
          @stylesheet_node = stylesheet_node
          @epub_inspector = epub_inspector
        end

        def attributes
          {
            source_identifier: source_identifier,
            name: name
          }
        end

        def source_identifier
          id
        end

        def name
          source_identifier
        end

        def raw_styles
          @epub_inspector.read_rendition_source_by_href(href)
        end

        def ingestion_source(text)
          text.ingestion_sources.find_by(source_identifier: id)
        end

        protected

        def href
          @stylesheet_node.attribute("href")&.value
        end

        def id
          @stylesheet_node.attribute("id")&.value
        end

      end
    end
  end
end
