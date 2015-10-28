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

          def create(title_nodes)
            titles = title_nodes.each_with_index.map do |title_node, index|
              node_inspector = Inspector::Metadata.new(title_node, @metadata_node)
              attr = title_attributes(node_inspector, index)
              title = TextTitle.new(defaults(DEFAULT_ATTRIBUTES, attr))
              info "services.ingestor.strategy.epub3.log.new_title", title: title.value
              title
            end
            titles
          end

          private

          def title_attributes(node_inspector, index = nil)
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
