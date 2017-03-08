require "redcarpet"

module Ingestor
  module Strategy
    module Gitbook
      module Inspector
        # Inspects Gitbook structures
        class Structure < ::Ingestor::Inspector::StructureInspector

          def initialize(gitbook_inspector)
            @gitbook_inspector = gitbook_inspector
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
            toc_node.xpath(selector_toc_nodes)
          end

          # to go in abstract class
          # rubocop: disable Metrics/MethodLength
          # rubocop: disable Metrics/AbcSize
          # @todo: Reduce method length, reduce complexity
          def nodes_to_structure(nodes)
            items = []
            if nodes.count
              nodes.each do |node|
                if node.at_xpath("a")
                  label = node.at_css("a").text
                  href = node.at_css("a").attribute("href").value
                elsif node.at_xpath("span")
                  label = node.at_css("span").text.strip
                  href = nil
                end
                item = make_structure_item(label, href)

                if node.at_xpath("ol/li|ul/li")
                  item[:children] = nodes_to_structure(node.xpath("ol/li|ul/li"))
                end
                items.push item unless item.empty?
              end
            end
            items
          end

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
            Nokogiri::XML("<body>" + nav_xml + "</body>").xpath(selector_toc_root_node)[0]
          end

          def nav_xml
            markdown = IO.read(@gitbook_inspector.summary_path)
            renderer = Redcarpet::Render::HTML.new
            redcarpet = Redcarpet::Markdown.new(renderer, fenced_code_blocks: true)
            redcarpet.render(markdown)
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
