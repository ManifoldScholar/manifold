module Ingestor
  module Creator
    # Creates Manifold IngestionSources from Inspectors.
    #
    # @author Zach Davis
    class IngestionSources < AbstractCreator

      DEFAULT_ATTRIBUTES = {
        kind: IngestionSource::KIND_PUBLICATION_RESOURCE
      }.freeze

      def create(source_inspectors, current_sources = nil)
        sources = source_inspectors.each_with_index.map do |source_inspector, index|
          source = create_one(source_inspector, current_sources, index)
          source.valid? ? report(source) : report_invalid(source)
          source.valid? ? source : nil
        end
        sources.compact!
        @text.ingestion_sources = sources
        @text.ingestion_sources
      end

      def create_one(source_inspector, current_sources, index)
        extant_source = find_in_set(current_sources, compare_attr(source_inspector))
        source = extant_source || IngestionSource.new
        source.attributes = attributes_with_defaults(source_inspector, index: index)
        source.text = @text
        source
      end

      def report(source)
        key = if source.new_record?
                "services.ingestor.creator.log.new_source"
              else
                "services.ingestor.creator.log.updated_source"
              end
        info key, source_path: source.source_path
      end

      def report_invalid(source)
        key = "services.ingestor.creator.log.invalid_source"
        warn key, source_path: source.source_path
      end

      def compare_attr(source_inspector)
        {
          source_identifier: source_inspector.source_identifier
        }
      end

      def attributes(source_inspector, _options = {})
        {
          source_identifier: source_inspector.source_identifier.presence,
          source_path: source_inspector.source_path.presence,
          kind: source_inspector.kind.presence,
          attachment: source_inspector.attachment
        }
      end

    end
  end
end
