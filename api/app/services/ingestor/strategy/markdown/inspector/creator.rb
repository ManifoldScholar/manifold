module Ingestor
  module Strategy
    module Markdown
      module Inspector
        # Inspects Markdown for creator
        class Creator < ::Ingestor::Inspector::CreatorInspector

          def initialize(markdown_inspector)
            @markdown_inspector = markdown_inspector
          end

          def name
            @markdown_inspector.author
          end

          def sort_name
            @markdown_inspector.author
          end

        end
      end
    end
  end
end
