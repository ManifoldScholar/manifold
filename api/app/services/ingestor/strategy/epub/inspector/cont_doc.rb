require "memoist"
require "naught"

module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Provides information about a single content document in an EPUB package.
        #
        # @author Zach Davis
        class ContDoc
          extend Memoist

          def initialize(document, manifest_node, epub_inspector)
            @document = document || Naught.build
            @node = manifest_node
            @epub_inspector = epub_inspector
            @toc_inspector = epub_inspector.toc_inspector
          end

          def contdoc_resource_path
            node = @epub_inspector.rendition_source_node_by_id(@node.attribute("idref"))
            node.attribute("href")
          end
          memoize :contdoc_resource_path

          def guess_name
            guess_name_from_toc.presence ||
              guess_name_from_title.presence ||
              guess_name_from_headers.presence
          end

          def body
            @document.css("body").children.to_s.strip
          end

          def toc?
            nav_item = @epub_inspector.manifest_nav_item
            if nav_item
              return contdoc_resource_path == nav_item.attribute("href")
            end
            false
          end

          def kind
            return TextSection::KIND_COVER_IMAGE if cover?
            return TextSection::KIND_NAVIGATION if toc?
            TextSection::KIND_SECTION
          end

          def cover?
            cover_item = @epub_inspector.manifest_cover_item
            if cover_item
              cover_image_resource_path = cover_item.attribute("href")
              results = @document.css("[src=\"#{cover_image_resource_path}\"]")
              return results.length > 0
            end
            false
          end

          private

          def guess_name_from_headers
            title_node = nil
            %w(h1 h2 h3 h4 h5 h6).each do |tag|
              node = @document.css(tag).first
              if node
                title_node = node
                break
              end
            end
            return title_node.text if title_node
          end

          def guess_name_from_title
            title = @document.xpath("//title")
            return title.text if title
          end

          def guess_name_from_toc
            @epub_inspector.toc_inspector.toc_label_for_cont_doc(contdoc_resource_path)
          end
        end
      end
    end
  end
end
