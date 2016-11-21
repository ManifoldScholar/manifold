module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects epub for language
        class Language < ::Ingestor::Inspector::LanguageInspector

          def initialize(epub_inspector)
            @epub_inspector = epub_inspector
          end

          def language
            @epub_inspector.language_node.try(:text)
          end

        end
      end
    end
  end
end
