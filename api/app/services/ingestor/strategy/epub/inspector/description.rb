module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects epub for description
        class Description < ::Ingestor::Inspector::DescriptionInspector

          def initialize(epub_inspector)
            @epub_inspector = epub_inspector
          end

          def description
            @epub_inspector.description_node.try(:text)
          end

        end
      end
    end
  end
end
