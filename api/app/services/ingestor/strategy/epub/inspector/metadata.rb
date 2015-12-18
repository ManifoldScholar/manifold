require "memoist"
require "naught"

module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Returns information about a metadata node in a EPUB package manifest.
        class Metadata
          extend Memoist

          def initialize(node, metadata_node)
            @node = node || Naught.build
            @metadata_node = metadata_node
          end

          def position
            position_metadata_node.text
          end
          memoize :position

          def kind
            kind_metadata_node.text
          end
          memoize :kind

          def title_kind
            kind if TextTitle::ALLOWED_KINDS.include?(kind.presence)
          end

          def text
            @node.text
          end
          memoize :text

          def file_as
            file_as_metadata_node.text
          end
          memoize :file_as

          def file_as_metadata_node
            path = "//xmlns:meta[@refines='##{id}' and @property='file-as']"
            @metadata_node.xpath(path) || Naught.build
          end
          memoize :file_as_metadata_node

          def kind_metadata_node
            path = "//xmlns:meta[@refines='##{id}' and @property='title-type']"
            @metadata_node.xpath(path) || Naught.build
          end
          memoize :kind_metadata_node

          def position_metadata_node
            path = "//xmlns:meta[@refines='##{id}' and @property='display-seq']"
            @metadata_node.xpath(path) || Naught.build
          end
          memoize :position_metadata_node

          def id
            attribute("id")
          end
          memoize :id

          private

          def attribute(name)
            @node.attribute(name) || Naught.build
          end
        end
      end
    end
  end
end
