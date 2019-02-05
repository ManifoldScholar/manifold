module Ingestions
  module Strategy
    module Epub
      # Inspects a single epub ingestion source
      class IngestionSource

        def initialize(source_node, epub_inspector)
          @source_node = source_node
          @epub_inspector = epub_inspector
        end

        def attributes
          {
            source_identifier: source_identifier,
            source_path: source_path,
            kind: kind,
            attachment: attachment
          }
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
          @source_node.attribute("id")&.value
        end

        def properties
          @source_node.attribute("properties")&.value
        end

        def href
          @source_node.attribute("href")&.value
        end

      end
    end
  end
end
