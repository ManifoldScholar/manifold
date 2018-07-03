module Ingestions
  module Strategy
    module Epub
      # Inspects epub for maker details
      class Maker

        def initialize(maker_node, epub_inspector)
          @maker_node = maker_node
          @epub_inspector = epub_inspector
        end

        def attributes
          {
            name: name,
            sort_name: sort_name
          }
        end

        def name
          @maker_node.text
        end

        def sort_name
          path = "//xmlns:meta[@refines='##{id}' and @property='file-as']"
          node = @epub_inspector.metadata_node.xpath(path)
          return nil unless node
          node.text
        end

        protected

        def id
          @maker_node.attribute("id")&.value
        end

      end
    end
  end
end
