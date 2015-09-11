require 'memoist'
require 'naught'

module Ingestor
  module Strategy
    module EPUB3
      module Inspector
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

          def text
            @node.text
          end
          memoize :text

          def file_as
            file_as_metadata_node.text
          end
          memoize :file_as

          def file_as_metadata_node
            @metadata_node.xpath("//xmlns:meta[@refines='##{id}' and @property='file-as']") || Naught.build
          end
          memoize :file_as_metadata_node

          def kind_metadata_node
            @metadata_node.xpath("//xmlns:meta[@refines='##{id}' and @property='title-type']") || Naught.build
          end
          memoize :kind_metadata_node

          def position_metadata_node
            @metadata_node.xpath("//xmlns:meta[@refines='##{id}' and @property='display-seq']") || Naught.build
          end
          memoize :position_metadata_node

          def id
            attribute('id')
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
