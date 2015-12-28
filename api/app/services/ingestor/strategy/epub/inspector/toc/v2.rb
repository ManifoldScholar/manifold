module Ingestor
  module Strategy
    module EPUB
      module Inspector
        class TOC
          # This module contributes object methods to the TOC inspector for EPUB2
          # documents.
          module V2
            def landmarks_structure
              # rubocop: disable Metrics/LineLength
              landmarks_nodes_to_structure(@epub_inspector.guide_node.xpath("xmlns:reference"))
            end

            private

            def selector_toc_root_node
              "//navMap"
            end

            def selector_toc_node
              "navPoint"
            end

            def selector_page_list_root_node
              "//pageList"
            end

            def selector_page_list_node
              "pageTarget"
            end

            def selector_header_node
              "//navLabel/text/text()"
            end

            def selector_toc_label
              "//*[starts-with(@src,'%s')]/../navLabel/text/text()"
            end

            # We're relying on the guide element in the opf file; there's no title for
            # this
            def landmarks_title
              ""
            end

            # rubocop: disable Metrics/AbcSize
            # rubocop: disable Metrics/MethodLength
            def nodes_to_structure(nodes)
              items = []
              if nodes.count
                nodes.each do |node|
                  item = {}
                  if node.at_xpath("content")
                    label = node.at_xpath("navLabel/text/text()").text
                    href = node.at_css("content").attribute("src").value
                    item = make_structure_item(label, href)
                    if node.at_xpath("navPoint")
                      item[:children] = toc_nodes_to_structure(node.xpath("navPoint"))
                    end
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

            # Landmarks are different than the other two
            def landmarks_nodes_to_structure(nodes)
              items = []
              if nodes.count
                nodes.each do |node|
                  label = node.at_xpath("@title").value
                  href = node.at_xpath("@href").value
                  items.push make_structure_item(label, href)
                end
              end
              items
            end
          end
        end
      end
    end
  end
end
