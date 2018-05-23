module Ingestor
  module Strategy
    module GoogleDoc
      module Inspector
        # Inspects Google Doc structures
        class Structure < ::Ingestor::Inspector::StructureInspector

          def initialize(google_doc_inspector)
            @google_doc_inspector = google_doc_inspector
            @ingestion = @google_doc_inspector.ingestion
          end

          def toc
            build_toc_from_headers
          end

          def landmarks
            []
          end

          def page_list
            []
          end

          protected

          # Store this as its own instance because we remove nodes
          # from the copy as we go through it.
          def body_parsed
            @body_parsed ||= @google_doc_inspector.index_parsed
          end

          def build_toc_from_headers
            entries = []
            toc_selectors.each do |tag|
              nodes = body_parsed.css(tag)
              next if nodes.count.zero?
              nodes.each do |node|
                item = compose_and_traverse node, node == nodes.last
                entries.push item if item.present?
              end
            end

            entries
          end

          # Creates the toc entry for a node.  Recursively checks for
          # nodes of the subsequent header level to create the children
          # array.
          def compose_and_traverse(node, last_of_kind = false)
            return nil if node.text.blank?
            item = make_structure_item(node)
            return item unless toc_child_selector(node.name).present?

            children = make_child_items node, last_of_kind
            item[:children] = children if children.present?

            item
          end

          def make_child_items(node, last_of_kind)
            nodes = last_of_kind ? nodes_after(node) : nodes_between(node)
            return [] unless nodes.present?
            children = nodes.map { |child| compose_and_traverse child }.reject(&:nil?)
            nodes.remove

            children
          end

          def make_structure_item(node)
            label = node.text.strip
            source_path = @google_doc_inspector.index_path
            anchor = node["id"]
            {
              label: label,
              anchor: anchor,
              source_path: source_path
            }
          end

          private

          def toc_selectors
            %w(h1 h2 h3 h4 h5 h6)
          end

          def toc_child_selector(selector)
            toc_selectors[toc_selectors.find_index(selector) + 1]
          end

          def node_selector_after(node, tag)
            "//*[@id='#{node['id']}']/following::#{tag}"
          end

          def node_selector_before(node)
            start = body_parsed.at_xpath node_selector_after(node, node.name)
            return "//#{toc_child_selector(node.name)}" unless start.present?
            "//*[@id='#{start['id']}']/preceding::#{toc_child_selector(node.name)}"
          end

          def nodes_after(node)
            body_parsed.xpath node_selector_after(node, toc_child_selector(node.name))
          end

          def nodes_before(node)
            body_parsed.xpath node_selector_before(node)
          end

          def nodes_between(node)
            nodes_after(node) & nodes_before(node)
          end
        end
      end
    end
  end
end
