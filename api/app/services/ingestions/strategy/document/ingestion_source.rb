module Ingestions
  module Strategy
    module Document
      class IngestionSource

        def initialize(strategy, source)
          @context = strategy.context
          @inspector = strategy.inspector
          @ingestion_source = source
        end

        def attributes
          {
            source_identifier: @context.basename(@ingestion_source),
            source_path: @ingestion_source,
            kind: kind,
            attachment: @context.open(@ingestion_source)
          }
        end

        private

        # TODO: Should there be a stylesheet ingestion source kind?
        def kind
          ::IngestionSource::KIND_SECTION if @ingestion_source == @inspector.source
          ::IngestionSource::KIND_PUBLICATION_RESOURCE
        end

      end
    end
  end
end
