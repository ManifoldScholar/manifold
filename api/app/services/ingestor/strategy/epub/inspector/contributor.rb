module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects epub for contributor info
        class Contributor < ::Ingestor::Inspector::CreatorInspector

          def initialize(_contributor, epub_inspector)
            @contributor_node = creator_node
            @epub_inspector = epub_inspector
          end

          def name
            @contributor_node.text
          end

          def sort_name
            path = "//xmlns:meta[@refines='##{id}' and @property='file-as']"
            node = @epub_inspector.metadata_node.xpath(path)
            return nil unless node
            node.text
          end

          protected

          def id
            @contributor_node.attribute("id").try(:value)
          end

        end
      end
    end
  end
end
