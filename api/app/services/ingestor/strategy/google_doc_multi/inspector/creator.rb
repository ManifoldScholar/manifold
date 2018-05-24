module Ingestor
  module Strategy
    module GoogleDocMulti
      module Inspector
        class Creator < ::Ingestor::Inspector::CreatorInspector

          def initialize(author)
            @author = author
          end

          def name
            @author["name"]
          end

          def sort_name
            name
          end

        end
      end
    end
  end
end
