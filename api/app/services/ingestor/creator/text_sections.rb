module Ingestor
  module Creator
    # Creates Manifold IngestionSources from Inspectors.
    #
    # @author Zach Davis
    class TextSections < AbstractCreator

      DEFAULT_ATTRIBUTES = {}.freeze

      def create(inspectors, current_sections = nil)
        sections = inspectors.each_with_index.map do |inspector, index|
          extant_section = find_in_set(current_sections, compare_attr(inspector))
          section = extant_section || @text.text_sections.new
          section.attributes = attributes_with_defaults(inspector, index: index)
          report(section)
          section
        end
        sections
      end

      private

      def report(sections)
        if sections.new_record?
          debug "services.ingestor.creator.log.new_section", name: sections.name
        else
          debug "services.ingestor.creator.log.updated_section", name: sections.name
        end
      end

      def compare_attr(inspector)
        {
          source_identifier: inspector.source_identifier
        }
      end

      def attributes(inspector, options = {})
        {
          name: inspector.name,
          source_body: inspector.source_body,
          ingestion_source: inspector.ingestion_source(@text),
          source_identifier: inspector.source_identifier,
          position: options[:index],
          kind: inspector.kind
        }
      end

    end
  end
end
