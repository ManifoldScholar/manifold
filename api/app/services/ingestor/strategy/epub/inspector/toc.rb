require "memoist"
require "naught"

module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # The <tt></tt> class is responsible for parsing the navigation nodes--typically
        # ordered lists--in an EPUB document and producing a hash with the correct labels
        # and paths to internal EPUB source documents. This structure eventually serves
        # as the input to the TOC structure transformer, which will update the urls to
        # link to Manifold text sections.
        #
        # @author Zach Davis
        # rubocop: disable Metrics/ClassLength
        class TOC
          extend Memoist
          include Ingestor::Loggable

          V3_SELECTOR_TOC_NODE = "//nav[@type='toc']"
          V2_SELECTOR_TOC_NODE = "//navMap/navPoint"
          SELECTOR_PAGE_LIST_NODE = "//nav[@type='page-list']"
          SELECTOR_LANDMARK_NODE = "//nav[@type='landmarks']"
          # rubocop: disable Metrics/LineLength
          V3_SELECTOR_HEADER_NODE = "//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]"
          V2_SELECTOR_HEADER_NODE = "//navLabel/text/text()"

          def initialize(epub_inspector)
            @epub_inspector = epub_inspector
            @logger = epub_inspector.logger
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
            path = @epub_inspector.v2? ? V2_SELECTOR_TOC_NODE : V3_SELECTOR_TOC_NODE
            @nav_xml.xpath(path)
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
            path = @epub_inspector.v2? ? V2_SELECTOR_HEADER_NODE : V3_SELECTOR_HEADER_NODE
            header = node.xpath(path).first
            text = header ? header.text : ""
            text
          end

          def toc_title
            text = header_text_for_node(toc_node)
            debug "services.ingestor.strategy.ePUB.log.toc_nav_title", text: text
            text
          end

          def page_list_title
            text = header_text_for_node(page_list_node)
            debug "services.ingestor.strategy.ePUB.log.page_list_nav_title", text: text
            text
          end

          def landmarks_title
            text = header_text_for_node(landmarks_node)
            debug "services.ingestor.strategy.ePUB.log.landmark_nav_title", text: text
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
