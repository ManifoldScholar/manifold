module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects epub for publication date
        class Date < ::Ingestor::Inspector::DateInspector

          def initialize(epub_inspector)
            @epub_inspector = epub_inspector
          end

          def date
            @epub_inspector.date_node.try(:text)
          end

        end
      end
    end
  end
end
