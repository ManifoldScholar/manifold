module Ingestions
  module Strategy
    module Epub
      # Inspects epub for cover details
      class Cover

        def initialize(epub_inspector)
          @epub_inspector = epub_inspector
        end

        def cover(text)
          text.ingestion_sources.find_by(
            source_identifier: @epub_inspector.manifest_cover_node_id
          )
        end

      end
    end
  end
end
