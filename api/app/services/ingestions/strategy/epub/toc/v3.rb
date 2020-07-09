module Ingestions
  module Strategy
    module Epub
      class TOC
        # This module contributes object methods to the TOC inspector for EPUB3
        # documents.
        module V3
          def landmarks_structure
            nodes = landmarks_node.xpath(selector_landmark_node)
            landmarks_nodes_to_structure(nodes)
          end

          private

          def selector_toc_root_node
            "//xmlns:nav[@epub:type='toc']/xmlns:ol"
          end

          def selector_toc_node
            "xmlns:li"
          end

          def selector_page_list_root_node
            "//xmlns:nav[@epub:type='page-list']/xmlns:ol"
          end

          def selector_page_list_node
            "xmlns:li"
          end

          def selector_landmark_root_node
            "//xmlns:nav[@epub:type='landmarks']/xmlns:ol"
          end

          def selector_landmark_node
            "xmlns:li"
          end

          def selector_toc_label
            "//*[@href='%s']"
          end

          def selector_header_node
            "//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]"
          end

          def landmarks_title
            text = header_text_for_node(landmarks_node)
            @context.debug "services.ingestions.inspector.log.landmark_nav_title",
                           text: text
            text
          end

          def landmarks_node
            @nav_xml.xpath(selector_landmark_root_node)
          end

          # rubocop: disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
          def nodes_to_structure(nodes)
            items = []
            if nodes.count
              nodes.each do |node|
                if node.at_xpath("descendant::xmlns:a")
                  a_node = node.at_xpath("descendant::xmlns:a")
                  label = a_node.text
                  href = a_node.attribute("href")&.value
                  type = a_node.attribute("type")&.value
                elsif node.at_xpath("xmlns:span")
                  label = node.at_xpath("xmlns:span").text.strip
                  href = nil
                  type = nil
                end

                item = make_structure_item(label, href, type)
                item[:children] = nodes_to_structure(node.xpath("xmlns:ol/xmlns:li")) if node.at_xpath("xmlns:ol/xmlns:li")
                items.push item unless item.empty?
              end
            end
            items
          end
          # rubocop: enable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

          def toc_nodes_to_structure(nodes)
            nodes_to_structure(nodes)
          end

          def page_list_nodes_to_structure(nodes)
            nodes_to_structure(nodes)
          end

          def landmarks_nodes_to_structure(nodes)
            nodes_to_structure(nodes)
          end
        end
      end
    end
  end
end
