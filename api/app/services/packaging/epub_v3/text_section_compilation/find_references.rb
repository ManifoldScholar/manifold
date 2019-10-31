module Packaging
  module EpubV3
    module TextSectionCompilation
      # Find referenced image assets, etc.
      class FindReferences
        include Dry::Transaction::Operation
        include Packaging::EpubV3::Import["reference_selectors"]

        # @param [Hash] state
        # @option state [Nokogiri::HTML::Document] :document
        # @option state [HTMLNodes::Node] :node
        # @option state [<Packaging::EpubV3::StylesheetItem>] :stylesheets
        # @option state [TextSection] :text_section
        # @return [Dry::Types::Result(Packaging::EpubV3::TextSectionItem)]
        def call(state)
          reference_selectors.flat_map do |reference_selector|
            item_args = {
              selector: reference_selector
            }

            state[:document].css(reference_selector.selector).map do |node|
              path = Packaging::Shared::ReferencedPath.new node.attr(reference_selector.attribute)

              Packaging::EpubV3::ReferencedItem.new(item_args.merge(node: node, path: path))
            end
          end
        end
      end
    end
  end
end
