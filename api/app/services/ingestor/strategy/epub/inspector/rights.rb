module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects epub for rights
        class Rights < ::Ingestor::Inspector::RightsInspector

          def initialize(epub_inspector)
            @epub_inspector = epub_inspector
          end

          def rights
            @epub_inspector.rights_node.try(:text)
          end

        end
      end
    end
  end
end
