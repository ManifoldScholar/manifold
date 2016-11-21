module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects epub for cover details
        class Cover < ::Ingestor::Inspector::CoverInspector

          def initialize(epub_inspector)
            @epub_inspector = epub_inspector
          end

          def cover(text)
            text.ingestion_sources.find_by(
              source_identifier:  @epub_inspector.manifest_cover_item_id
            )
          end

        end
      end
    end
  end
end
