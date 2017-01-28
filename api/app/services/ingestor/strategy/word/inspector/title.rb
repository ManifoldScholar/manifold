module Ingestor
  module Strategy
    module Word
      module Inspector
        # Inspects Word title
        class Title < ::Ingestor::Inspector::TitleInspector

          def initialize(word_inspector)
            @word_inspector = word_inspector
          end

          def value
            @word_inspector.title
          end

          def position
            1
          end

          def kind
            TextTitle::KIND_MAIN
          end

        end
      end
    end
  end
end
