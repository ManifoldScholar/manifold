require 'memoist'
require 'naught'

module Ingestor
  module Strategy
    module EPUB3
      module Inspector
        class ContDoc

          extend Memoist

          def initialize(document, manifest_node, epub_inspector)
            @document = document || Naught.build
            @node = manifest_node
            @epub_inspector = epub_inspector
            @toc_inspector = epub_inspector.toc_inspector
          end

          def contdoc_resource_path
            node = @epub_inspector.rendition_source_node_by_id(@node.attribute('idref'))
            node.attribute('href')
          end
          memoize :contdoc_resource_path

          def guess_name
            guess_name_from_toc.presence ||
            guess_name_from_title.presence ||
            guess_name_from_headers.presence
          end

          def body
            @document.css('body').children.to_s.strip
          end

          def is_toc?
            nav_item = @epub_inspector.manifest_nav_item
            puts nav_item
            puts contdoc_resource_path
            if nav_item
              return contdoc_resource_path == nav_item.attribute('href')
            end
            false
          end

          def kind
            return TextSection::KIND_COVER_IMAGE if is_cover?
            return TextSection::KIND_NAVIGATION if is_toc?
            return TextSection::KIND_SECTION
          end

          def is_cover?
            cover_item = @epub_inspector.manifest_cover_item
            if cover_item
              cover_image_resource_path = cover_item.attribute('href')
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
            if title_node
              return title_node.text
            end

          end

          def guess_name_from_title
            title = @document.xpath('//title')
            if title
              return title.text
            end
          end

          def guess_name_from_toc
            @epub_inspector.toc_inspector.toc_label_for_cont_doc(contdoc_resource_path)
          end

        end
      end
    end
  end
end
