module Ingestor
  module Strategy
    module Markdown
      module Inspector
        # Inspects Markdown for cover details
        class Cover < ::Ingestor::Inspector::CoverInspector

          def initialize(markdown_inspector)
            @markdown_inspector = markdown_inspector
          end

          def cover(text)
            text.ingestion_sources.find_by(source_path: "cover.jpg")
          end

        end
      end
    end
  end
end
