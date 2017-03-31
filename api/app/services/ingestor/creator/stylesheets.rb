module Ingestor
  module Creator
    # Creates Manifold IngestionSources from Inspectors.
    #
    # @author Zach Davis
    class Stylesheets < AbstractCreator

      DEFAULT_ATTRIBUTES = {}.freeze

      def create(stylesheet_inspectors, current_stylesheets = nil)
        stylesheets = stylesheet_inspectors.each_with_index.map do |inspector, index|
          extant_stylesheet = find_in_set(current_stylesheets, compare_attr(inspector))
          stylesheet = extant_stylesheet || @text.stylesheets.new
          stylesheet.attributes = attributes_with_defaults(inspector, index: index)
          report(stylesheet)
          stylesheet
        end
        stylesheets
      end

      private

      def report(stylesheet)
        if stylesheet.new_record?
          info "services.ingestor.creator.log.new_stylesheet", name: stylesheet.name
        else
          info "services.ingestor.creator.log.updated_stylesheet", name: stylesheet.name
        end
      end

      def compare_attr(inspector)
        {
          source_identifier: inspector.source_identifier
        }
      end

      def attributes(inspector, _options = {})
        {
          name: inspector.name,
          raw_styles: inspector.raw_styles,
          ingestion_source: inspector.ingestion_source(@text),
          source_identifier: inspector.source_identifier
        }
      end

    end
  end
end
