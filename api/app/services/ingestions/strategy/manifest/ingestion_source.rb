module Ingestions
  module Strategy
    module Manifest
      class IngestionSource

        def initialize(strategy, source)
          @context = strategy.context
          @inspector = strategy.inspector
          @ingestion_source = source
        end

        def attributes
          {
            source_identifier: source_identifier,
            source_path: source_path,
            kind: kind,
            attachment: @context.open(@ingestion_source)
          }
        end

        private

        def source_path
          @context.rel(@context.abs(@ingestion_source), @context.source_root)
        end

        def source_identifier
          Digest::MD5.hexdigest source_path
        end

        def ext
          @context.extension(@context.abs(@ingestion_source))
        end

        def manifest?
          @ingestion_source == @inspector.manifest_path
        end

        def section?
          Ingestions.converters.convertible_extensions.include? ext
        end

        def kind
          if manifest?
            ::IngestionSource::KIND_NAVIGATION
          elsif section?
            ::IngestionSource::KIND_SECTION
          else
            ::IngestionSource::KIND_PUBLICATION_RESOURCE
          end
        end

      end
    end
  end
end
