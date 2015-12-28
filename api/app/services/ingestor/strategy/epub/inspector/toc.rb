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
        class TOC
          extend Memoist
          include Ingestor::Loggable

          def initialize(epub_inspector)
            @epub_inspector = epub_inspector
            @logger = epub_inspector.logger
            @nav_xml = @epub_inspector.nav_xml
            @nav_path = @epub_inspector.nav_path

            extend @epub_inspector.v2? ? V2 : V3
          end

          # @todo: This isn't working with relative nav paths. (Eg. GhV-oeb-page epub)
          def toc_label_for_cont_doc(contdoc_resource_path)
            return unless @nav_xml
            link = @nav_xml.at_xpath(selector_toc_label % contdoc_resource_path)
            return link.text if link && link.element_children.length == 0
          end
          memoize :toc_label_for_cont_doc

          def text_structure
            {
              titles: structure_titles,
              toc: toc_structure,
              page_list: page_list_structure,
              landmarks: landmarks_structure
            }
          end

          def toc_structure
            nodes = toc_node.xpath(selector_toc_node)
            toc_nodes_to_structure(nodes)
          end

          def page_list_structure
            nodes = page_list_node.xpath(selector_page_list_node)
            page_list_nodes_to_structure(nodes)
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
            @nav_xml.xpath(selector_toc_root_node)
          end
          memoize :toc_node

          def page_list_node
            @nav_xml.xpath(selector_page_list_root_node)
          end
          memoize :page_list_node

          def header_text_for_node(node)
            header = node.at_xpath(selector_header_node)
            header ? header.text : ""
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

          def make_structure_item(raw_label, raw_path = nil)
            label = raw_label.strip

            anchor = source_path = ""
            unless raw_path.nil?
              relative_source_path, anchor = raw_path.split('#')
              source_path =
                Helper::URI.to_absolute_package_path(relative_source_path, @nav_path)
            end

            {
              label: label,
              anchor: anchor,
              source_path: source_path
            }
          end
        end
      end
    end
  end
end
