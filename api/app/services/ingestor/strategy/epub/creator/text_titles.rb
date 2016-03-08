module Ingestor
  module Strategy
    module EPUB
      module Creator
        # Creates Manifold TextTitles from EPUB title nodes.
        #
        # @author Zach Davis
        class TextTitles < BaseCreator
          DEFAULT_ATTRIBUTES = {
            value: "Untitled",
            kind: TextTitle::KIND_MAIN
          }.freeze

          def create(title_nodes, existing = nil)
            titles = title_nodes.each_with_index.map do |title_node, index|
              node_inspector = Inspector::Metadata.new(title_node, @metadata_node)
              attr = defaults(DEFAULT_ATTRIBUTES, attributes(node_inspector, index))
              existing_title = check_for_existing(existing, value: attr[:value])
              attr = defaults(DEFAULT_ATTRIBUTES, attr)
              title = existing_title || TextTitle.create(attr)
              title.update_attributes(attr)
              debug "services.ingestor.strategy.ePUB.log.new_title", title: title.value
              title
            end
            titles
          end

          private

          def attributes(node_inspector, index = nil)
            {
              value: node_inspector.text.presence,
              position: node_inspector.position.presence || index,
              kind: node_inspector.title_kind
            }
          end
        end
      end
    end
  end
end
