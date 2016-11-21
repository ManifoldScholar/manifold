module Ingestor
  module Strategy
    module Gitbook
      module Inspector
        # Inspects GitBook for creator
        class Creator < ::Ingestor::Inspector::CreatorInspector

          def initialize(gitbook_inspector)
            @gitbook_inspector = gitbook_inspector
          end

          def name
            @gitbook_inspector.author
          end

          def sort_name
            @gitbook_inspector.author
          end

        end
      end
    end
  end
end
