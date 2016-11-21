module Ingestor
  module Strategy
    module Gitbook
      module Inspector
        # Inspects GitBook for cover details
        class Cover < ::Ingestor::Inspector::CoverInspector

          def initialize(gitbook_inspector)
            @gitbook_inspector = gitbook_inspector
          end

          def cover(text)
            text.ingestion_sources.find_by(source_path: "cover.jpg")
          end

        end
      end
    end
  end
end
