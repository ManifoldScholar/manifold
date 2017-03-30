module Ingestor
  module Creator
    # Creates Manifold TextTitles from title Reporters.
    #
    # @author Zach Davis
    class TextTitles < AbstractCreator

      DEFAULT_ATTRIBUTES = {
        value: "Untitled",
        kind: TextTitle::KIND_MAIN
      }.freeze

      def create(title_inspectors, current_titles = nil)
        titles = title_inspectors.each_with_index.map do |title_inspector, index|
          extant_title = find_in_set(current_titles, compare_attr(title_inspector))
          title = extant_title || @text.titles.new
          title.attributes = attributes_with_defaults(title_inspector, index: index)
          report(title)
          title
        end
        titles
      end

      private

      def report(title)
        if title.new_record?
          info "services.ingestor.creator.log.new_title", title: title.value
        else
          info "services.ingestor.creator.log.updated_title", title: title.value
        end
      end

      def compare_attr(title_inspector)
        {
          value: title_inspector.value
        }
      end

      def attributes(title_inspector, options = {})
        {
          value: title_inspector.value.presence,
          position: title_inspector.position.presence || options[:index],
          kind: title_inspector.kind.presence
        }
      end
    end
  end
end
