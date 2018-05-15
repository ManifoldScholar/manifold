module Ingestor
  module Strategy
    module Html
      module Inspector
        # Inspects HTML structures
        class Structure < ::Ingestor::Inspector::StructureInspector

          def initialize(html_inspector)
            @html_inspector = html_inspector
            @ingestion = @html_inspector.ingestion
          end

          def toc
            nodes_to_structure(toc_nodes)
          end

          def landmarks
            []
          end

          def page_list
            []
          end

          protected

          def toc_nodes
            toc_node&.xpath(selector_toc_nodes) || []
          end

          # rubocop: disable Metrics/MethodLength, Metrics/AbcSize
          def nodes_to_structure(nodes)
            items = []
            if nodes.count
              nodes.each do |node|
                next unless node.at_xpath("a")
                label = node.at_css("a").text
                href = node.at_css("a").attribute("href").value
                item = make_structure_item(label, href)

                if node.at_xpath("ol/li|ul/li")
                  item[:children] = nodes_to_structure(node.xpath("ol/li|ul/li"))
                end

                items.push item if item.present?
              end
            end
            items
          end
          # rubocop: enable Metrics/MethodLength, Metrics/AbcSize

          def make_structure_item(raw_label, raw_path = nil)
            label = raw_label.strip
            anchor = source_path = ""
            source_path, anchor = raw_path.split("#") unless raw_path.nil?
            {
              label: label,
              anchor: anchor,
              source_path: source_path
            }
          end

          # specific to this implementation
          def toc_node
            @html_inspector.index_parsed.css("[data-navigation]")[0]
          end

          def selector_toc_root_node
            "//ul"
          end

          def selector_toc_nodes
            "li"
          end

        end
      end
    end
  end
end
