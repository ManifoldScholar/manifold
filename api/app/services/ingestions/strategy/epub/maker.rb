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
            name: name
          }
        end

        def name
          @maker_node.text
        end

      end
    end
  end
end
