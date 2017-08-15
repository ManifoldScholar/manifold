module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects a single epub ingestion source
        class IngestionSource < ::Ingestor::Inspector::IngestionSourceInspector

          def initialize(source_node, epub_inspector)
            @source_node = source_node
            @epub_inspector = epub_inspector
          end

          def source_identifier
            id
          end

          def source_path
            @epub_inspector.rendition_href_to_path(href)
          end

          def attachment
            return nil if uri?(href)
            @epub_inspector.open_rendition_source_by_href(href)
          end

          def kind
            if properties
              return ::IngestionSource::KIND_COVER_IMAGE if
                properties.include? "cover-image"
              return ::IngestionSource::KIND_NAVIGATION if
                properties.include? "nav"
            end
            ::IngestionSource::KIND_PUBLICATION_RESOURCE
          end

          protected

          def uri?(string)
            uri = URI.parse(string)
            %w(http https).include?(uri.scheme)
          rescue URI::BadURIError
            false
          rescue URI::InvalidURIError
            false
          end

          def id
            @source_node.attribute("id").try(:value)
          end

          def properties
            @source_node.attribute("properties").try(:value)
          end

          def href
            @source_node.attribute("href").try(:value)
          end

        end
      end
    end
  end
end
