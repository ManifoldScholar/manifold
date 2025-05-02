# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextSectionCompilation
      # Compile the accumulated state from the previous steps into
      # a {Packaging::EpubV3::TextSectionItem finalized text section proxy}.
      class Finalize
        include ::Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Nokogiri::HTML::Document] :document
        # @option state [HTMLNodes::Node] :node
        # @option state [<Packaging::EpubV3::ReferencedItem>] :referenced_items
        # @option state [<Packaging::EpubV3::StylesheetItem>] :stylesheets
        # @option state [TextSection] :text_section
        # @return [Dry::Types::Result(Packaging::EpubV3::TextSectionItem)]
        def call
          state[:namespace_set] = HTMLNodes::ExtractNamespaces.run! state

          item = Packaging::EpubV3::TextSectionItem.new(state)

          self.pipeline_result = item

          Success item
        end
      end
    end
  end
end
