module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects epub for creator details
        class Creator < ::Ingestor::Inspector::CreatorInspector

          def initialize(creator_node, epub_inspector)
            @creator_node = creator_node
            @epub_inspector = epub_inspector
          end

          def name
            @creator_node.text
          end

          def sort_name
            path = "//xmlns:meta[@refines='##{id}' and @property='file-as']"
            node = @epub_inspector.metadata_node.xpath(path)
            return nil unless node
            node.text
          end

          protected

          def id
            @creator_node.attribute("id").try(:value)
          end

        end
      end
    end
  end
end
