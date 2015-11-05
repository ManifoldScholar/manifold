require "memoist"
require "naught"

module Ingestor
  module Strategy
    module EPUB3
      module Inspector
        # Provides metadata for a single item in an EPUB3 manifest
        class ManifestItem
          NullAttribute = Naught.build do |config|
            config.define_explicit_conversions
            def value
              ""
            end
          end

          extend Memoist

          def initialize(node)
            @node = node || Naught.build
          end

          def href
            attribute("href").value
          end
          memoize :href

          def properties
            attribute("properties").value
          end
          memoize :properties

          def id
            attribute("id").value
          end
          memoize :id

          # cover-image == KIND_COVER_IMAGE
          # nav == KIND_NAVIGATION
          def kind
            return IngestionSource::KIND_COVER_IMAGE if properties.include? "cover-image"
            return IngestionSource::KIND_NAVIGATION if properties.include? "nav"
            IngestionSource::KIND_PUBLICATION_RESOURCE
          end

          private

          def attribute(name)
            attribute = @node.attribute(name)
            attribute || NullAttribute.new
          end
        end
      end
    end
  end
end
