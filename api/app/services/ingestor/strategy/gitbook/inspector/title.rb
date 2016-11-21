module Ingestor
  module Strategy
    module Gitbook
      module Inspector
        # Inspects GitBook title
        class Title < ::Ingestor::Inspector::TitleInspector

          def initialize(gitbook_inspector)
            @gitbook_inspector = gitbook_inspector
          end

          def value
            @gitbook_inspector.title
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
