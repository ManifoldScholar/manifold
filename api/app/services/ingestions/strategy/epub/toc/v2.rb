module Ingestions
  module Strategy
    module Epub
      class TOC
        # This module contributes object methods to the TOC inspector for EPUB2
        # documents.
        module V2
          def landmarks_structure
            landmarks_nodes_to_structure(guide_node_references)
          end

          private

          def guide_node_references
            @epub_inspector.guide_node&.css("reference")
          end

          def selector_toc_root_node
            "//xmlns:navMap"
          end

          def selector_toc_node
            "xmlns:navPoint"
          end

          def selector_page_list_root_node
            "//xmlns:pageList"
          end

          def selector_page_list_node
            "xmlns:pageTarget"
          end

          def selector_header_node
            "//xmlns:navLabel/xmlns:text/text()"
          end

          def selector_toc_label
            "//*[starts-with(@src,'%s')]/../xmlns:navLabel/xmlns:text/text()"
          end

          # We're relying on the guide element in the opf file; there's no title for
          # this
          def landmarks_title
            ""
          end

          # rubocop: disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
          def nodes_to_structure(nodes)
            items = []
            if nodes.count.positive?
              nodes.each do |node|
                item = {}
                if node.at(".//xmlns:content")
                  label = node.at(".//xmlns:navLabel/xmlns:text/text()")&.text
                  href = node.at("content")&.attribute("src")&.value
                  item = make_structure_item(label, href)

                  children = node > "xmlns|navPoint"
                  item[:children] = toc_nodes_to_structure(children) if children.present?
                end
                items.push item unless item.empty?
              end
            end
            items
          end
          # rubocop: enable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

          def toc_nodes_to_structure(nodes)
            nodes_to_structure(nodes)
          end

          def page_list_nodes_to_structure(nodes)
            nodes_to_structure(nodes)
          end

          # Landmarks are different than the other two
          def landmarks_nodes_to_structure(nodes)
            items = []
            if nodes&.count
              nodes.each do |node|
                label = node.at_xpath("@title").value
                href = node.at_xpath("@href").value
                type = node.at_xpath("@type").value
                items.push make_structure_item(label, href, type)
              end
            end
            items
          end
        end
      end
    end
  end
end
