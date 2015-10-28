require "memoist"
require "naught"

module Ingestor
  module Strategy
    module EPUB3
      module Inspector
        # The <tt></tt> class is responsible for parsing the navigation nodes--typically
        # ordered lists--in an EPUB3 document and producing a hash with the correct labels
        # and paths to internal EPUB3 source documents. This structure eventually serves
        # as the input to the TOC structure transformer, which will update the urls to
        # link to Manifold text sections.
        #
        # @author Zach Davis
        # rubocop: disable Metrics/ClassLength
        class TOC
          extend Memoist

          SELECTOR_TOC_NODE = "//nav[@type='toc']"
          SELECTOR_PAGE_LIST_NODE = "//nav[@type='page-list']"
          SELECTOR_LANDMARK_NODE = "//nav[@type='landmarks']"
          # rubocop: disable Metrics/LineLength
          SELECTOR_HEADER_NODE = "//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]"

          def initialize(epub_inspector)
            @epub_inspector = epub_inspector
            @nav_xml = @epub_inspector.nav_xml
            @nav_path = @epub_inspector.nav_path
          end

          # @todo: This isn't working with relative nav paths. (Eg. GhV-oeb-page epub)
          def toc_label_for_cont_doc(contdoc_resource_path)
            return unless @nav_xml
            link = @nav_xml.xpath("//*[@href='#{contdoc_resource_path}']").first
            return link.text if link && link.element_children.length == 0
          end
          memoize :toc_label_for_cont_doc

          def text_structure
            structure = {
              titles: structure_titles,
              toc: toc_structure,
              page_list: page_list_structure,
              landmarks: landmarks_structure
            }
            structure
          end

          private

          def structure_titles
            {
              toc: toc_title,
              page_list: page_list_title,
              landmarks: landmarks_title
            }
          end

          def toc_node
            @nav_xml.xpath(SELECTOR_TOC_NODE)
          end
          memoize :toc_node

          def page_list_node
            @nav_xml.xpath(SELECTOR_PAGE_LIST_NODE)
          end
          memoize :page_list_node

          def landmarks_node
            @nav_xml.xpath(SELECTOR_LANDMARK_NODE)
          end
          memoize :landmarks_node

          def header_text_for_node(node)
            header = node.xpath(SELECTOR_HEADER_NODE).first
            text = header ? header.text : ""
            text
          end

          def toc_title
            text = header_text_for_node(toc_node)
            @epub_inspector.log :debug, "TOC nav title is \"#{text}\""
            text
          end

          def page_list_title
            text = header_text_for_node(page_list_node)
            @epub_inspector.log :debug, "Page List nav title is \"#{text}\""
            text
          end

          def landmarks_title
            text = header_text_for_node(landmarks_node)
            @epub_inspector.log :debug, "Landmarks nav title is \"#{text}\""
            text
          end

          # rubocop: disable Metrics/MethodLength
          # rubocop: disable Metrics/AbcSize
          # @todo: Reduce method length, reduce complexity
          def ol_to_structure(ol)
            items = []
            if ol
              ol.element_children.each do |li|
                item = {}
                if li.at_xpath("a")
                  item[:label] = li.css("a").first.text.strip
                  href = li.css("a").first.attribute("href").value
                  relative_source_path, item[:anchor] = href.split('#')
                  item[:source_path] =
                    Helper::URI.to_absolute_package_path(relative_source_path, @nav_path)
                else
                  if li.at_xpath("span")
                    item[:label] = li.css("span").first.text.strip
                  end
                end
                if li.at_xpath("ol")
                  item[:children] = ol_to_structure(li.css("ol").first)
                end
                items.push item
              end
            end
            items
          end

          def toc_structure
            ol = toc_node.xpath("ol").first
            ol_to_structure(ol)
          end

          def page_list_structure
            ol = page_list_node.xpath("ol").first
            ol_to_structure(ol)
          end

          def landmarks_structure
            ol = landmarks_node.xpath("ol").first
            ol_to_structure(ol)
          end
        end
      end
    end
  end
end
