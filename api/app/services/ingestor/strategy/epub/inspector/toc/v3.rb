module Ingestor
  module Strategy
    module EPUB
      module Inspector
        class TOC
          # This module contributes object methods to the TOC inspector for EPUB3
          # documents.
          module V3
            def selector_toc_root_node
              "//nav[@type='toc']/ol"
            end

            def selector_toc_node
              "li"
            end

            def selector_page_list_root_node
              "//nav[@type='page-list']/ol"
            end

            def selector_page_list_node
              "li"
            end

            def selector_landmark_root_node
              "//nav[@type='landmarks']/ol"
            end

            def selector_landmark_node
              "li"
            end

            def selector_toc_label
              "//*[@href='%s']"
            end

            def selector_header_node
              "//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]"
            end

            def landmarks_title
              text = header_text_for_node(landmarks_node)
              debug "services.ingestor.strategy.ePUB.log.landmark_nav_title", text: text
              text
            end

            def landmarks_structure
              nodes = landmarks_node.xpath(selector_landmark_node)
              landmarks_nodes_to_structure(nodes)
            end

            def landmarks_node
              @nav_xml.xpath(selector_landmark_root_node)
            end

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

                  if node.at_xpath("ol/li")
                    item[:children] = nodes_to_structure(node.xpath("ol/li"))
                  end
                  items.push item unless item.empty?
                end
              end
              items
            end

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
end
