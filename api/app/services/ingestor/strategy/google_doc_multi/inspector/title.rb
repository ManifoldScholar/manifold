module Ingestor
  module Strategy
    module GoogleDocMulti
      module Inspector
        # Inspects Word title
        class Title < ::Ingestor::Inspector::TitleInspector

          def initialize(inspector)
            @inspector = inspector
          end

          def value
            @inspector.title
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
