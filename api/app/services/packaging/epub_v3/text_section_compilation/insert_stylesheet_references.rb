module Packaging
  module EpubV3
    module TextSectionCompilation
      # Insert remapped stylesheet references into the document's head.
      class InsertStylesheetReferences
        include Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Nokogiri::HTML::Document] :document
        # @option state [<Packaging::EpubV3::StylesheetItem>] :stylesheets
        # @return [void]
        def call(state)
          document = state[:document]

          head = document.at_css("head")

          state[:stylesheets].each do |stylesheet_item|
            link = Nokogiri::XML::Element.new("link", document).tap do |node|
              node.set_attribute("href", stylesheet_item.remapped_path)
              node.set_attribute("rel", "stylesheet")
              node.set_attribute("type", "text/css")
            end

            head.add_child link
          end
        end
      end
    end
  end
end
