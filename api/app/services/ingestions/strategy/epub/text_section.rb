require "memoist"

module Ingestions
  module Strategy
    module Epub
      # Inspects epub for a single text section
      class TextSection

        def initialize(strategy, spine_node, position)
          @spine_node = spine_node
          @context = strategy.context
          @epub_inspector = strategy.inspector
          @position = position
        end

        def attributes
          {
            source_identifier: source_identifier,
            name: name,
            kind: kind,
            position: @position
          }
        end

        def source_identifier
          idref
        end

        def source_path
          File.join(@epub_inspector.rel_source_root, text_section_resource_path)
        end

        def name
          name = guess_name_from_toc.presence ||
                 guess_name_from_headers.presence ||
                 guess_name_from_title.presence
          name&.squish
        end

        def kind
          return ::TextSection::KIND_COVER_IMAGE if cover?
          return ::TextSection::KIND_NAVIGATION if toc?

          ::TextSection::KIND_SECTION
        end

        def raw_html
          @context.read(source_path)
        end

        protected

        def text_section
          @epub_inspector.spine_item_parsed(idref)
        end

        def idref
          @spine_node.attribute("idref")&.value
        end

        def guess_name_from_headers
          title_node = nil
          %w(h1 h2 h3 h4 h5 h6).each do |tag|
            node = text_section.css(tag).first
            if node
              title_node = node
              break
            end
          end
          title_node&.text
        end

        def guess_name_from_title
          title = text_section.css("title")
          title&.text
        end

        def text_section_resource_path
          node = @epub_inspector.rendition_source_node_by_id(idref)
          value = node.attribute("href")&.value
          @epub_inspector.rendition_href_to_path(value)
        end

        def guess_name_from_toc
          @epub_inspector.toc_inspector.toc_label_for_cont_doc(
            text_section_resource_path
          )
        end

        def toc?
          toc_page = guess_toc_page_from_landmarks
          return text_section_resource_path == toc_page[:source_path] if toc_page

          false
        end

        def cover?
          cover_item = @epub_inspector.manifest_cover_node
          if cover_item
            cover_image_resource_path = cover_item.attribute("href")
            results = text_section.css("[src=\"#{cover_image_resource_path}\"]")
            return results.present?
          end
          false
        end

        def guess_toc_page_from_landmarks
          landmarks = @epub_inspector.toc_inspector.text_structure[:landmarks]
          landmarks.detect do |key|
            key[:type] == "toc" ||
              key[:anchor] == "toc" ||
              key[:label].include?("Contents")
          end
        end

      end
    end
  end
end
