module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects epub for a single stylesheet
        class Stylesheet < ::Ingestor::Inspector::StylesheetInspector

          def initialize(stylesheet_node, epub_inspector)
            @stylesheet_node = stylesheet_node
            @epub_inspector = epub_inspector
          end

          def source_identifier
            id
          end

          def name
            source_identifier
          end

          def raw_styles
            @epub_inspector.get_rendition_source(href).string
          end

          def ingestion_source(text)
            text.find_ingestion_source_by_identifier(id)
          end

          protected

          def href
            @stylesheet_node.attribute("href").try(:value)
          end

          def id
            @stylesheet_node.attribute("id").try(:value)
          end

        end
      end
    end
  end
end
