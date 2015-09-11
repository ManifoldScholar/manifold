require 'memoist'
require 'naught'

module Ingestor
  module Strategy
    module EPUB3
      module Inspector
        class TOC

          extend Memoist

          def initialize(epub_inspector)
            @epub_inspector = epub_inspector
            @nav_xml = @epub_inspector.nav_xml
            @nav_path = @epub_inspector.nav_path
          end

          # API
          def toc_label_for_cont_doc(contdoc_resource_path)
            if @nav_xml
              # TODO: This isn't working with relative nav paths. (Eg. GhV-oeb-page epub)
              link = @nav_xml.xpath("//*[@href='#{contdoc_resource_path}']").first
              if link && link.element_children.length == 0
                return link.text
              end
            end
          end
          memoize :toc_label_for_cont_doc

          def text_structure
            structure = {
                titles: {
                    toc: toc_title,
                    page_list: page_list_title,
                    landmarks: landmarks_title
                },
                toc: toc_structure,
                page_list: page_list_structure,
                landmarks: landmarks_structure
            }
            structure
          end

          private

          def toc_node
            @nav_xml.xpath("//nav[@type='toc']")
          end
          memoize :toc_node

          def page_list_node
            @nav_xml.xpath("//nav[@type='page-list']")
          end
          memoize :page_list_node

          def landmarks_node
            @nav_xml.xpath("//nav[@type='landmarks']")
          end
          memoize :landmarks_node

          def header_text_for_node(node)
            header = node.xpath("//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]").first
            text = header ? header.text : ''
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

          def ol_to_structure(ol)
            items = []
            if ol
              ol.element_children.each do |li|
                item = {}
                if li.at_xpath('a')
                  item[:label] = li.css("a").first.text.strip
                  href = li.css("a").first.attribute('href').value
                  relative_source_path, item[:anchor] = href.split('#')
                  item[:source_path] = Helper::URI.to_absolute_package_path(relative_source_path, @nav_path)
                else
                  if li.at_xpath('span')
                    item[:label] = li.css("span").first.text.strip
                  end
                end
                if li.at_xpath('ol')
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