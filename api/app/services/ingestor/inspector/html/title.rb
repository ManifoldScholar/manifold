module Ingestor
  module Inspector
    module HTML
      # Inspects HTML title
      module Title
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
