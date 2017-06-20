module Ingestor
  module Strategy
    module Markdown
      module Inspector
        # Inspects Markdown title
        class Title < ::Ingestor::Inspector::TitleInspector

          def initialize(markdown_inspector)
            @markdown_inspector = markdown_inspector
          end

          def value
            @markdown_inspector.title
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
