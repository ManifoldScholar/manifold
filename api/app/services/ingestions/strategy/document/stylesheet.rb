module Ingestions
  module Strategy
    module Document
      class Stylesheet

        def initialize(strategy, stylesheet_node, position)
          @stylesheet_node = stylesheet_node
          @context = strategy.context
          @document_inspector = strategy.inspector
          @position = position
        end

        def attributes
          {
            source_identifier: source_identifier,
            name: name,
            position: position
          }
        end

        def raw_styles
          return @stylesheet_node.content unless external?
          @context.read(@document_inspector.source_path_for_file(source_identifier))
        end

        private

        def external?
          return true if @stylesheet_node.name == "link"
          return false if @stylesheet_node.name == "style"
          raise "Invalid style chunk"
        end

        def source_identifier
          @stylesheet_node&.attribute("href")&.value
        end

        def position
          @position + 1
        end

        def name
          external? ? "stylesheet-#{position}" : "head-#{position}"
        end
      end
    end
  end
end
