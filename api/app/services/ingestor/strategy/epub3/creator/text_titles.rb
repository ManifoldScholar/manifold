module Ingestor
  module Strategy
    module EPUB3
      module Creator
        # Creates Manifold TextTitles from EPUB3 title nodes.
        #
        # @author Zach Davis
        class TextTitles < BaseCreator
          DEFAULT_ATTRIBUTES = {
            value: "Untitled",
            kind: TextTitle::KIND_MAIN
          }

          def create(title_nodes, existing = nil)
            titles = title_nodes.each_with_index.map do |title_node, index|
              node_inspector = Inspector::Metadata.new(title_node, @metadata_node)
              attr = defaults(DEFAULT_ATTRIBUTES, attributes(node_inspector, index))
              existing_title = check_for_existing(existing, value: attr[:value])
              attr = defaults(DEFAULT_ATTRIBUTES, attr)
              title = existing_title || TextTitle.create(attr)
              info "services.ingestor.strategy.epub3.log.new_title", title: title.value
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
