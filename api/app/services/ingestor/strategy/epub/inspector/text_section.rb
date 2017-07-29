module Ingestor
  module Strategy
    module EPUB
      module Inspector
        # Inspects epub for a single text section
        class TextSection < ::Ingestor::Inspector::TextSectionInspector

          def initialize(spine_node, epub_inspector)
            @spine_node = spine_node
            @epub_inspector = epub_inspector
          end

          def source_identifier
            idref
          end

          def name
            name = guess_name_from_toc.presence ||
                   guess_name_from_headers.presence ||
                   guess_name_from_title.presence
            name.try(:squish)
          end

          def source_body
            text_section.css("body").children.to_s.strip
          end

          def ingestion_source(text)
            text.find_ingestion_source_by_identifier(idref)
          end

          def kind
            return ::TextSection::KIND_COVER_IMAGE if cover?
            return ::TextSection::KIND_NAVIGATION if toc?
            ::TextSection::KIND_SECTION
          end

          protected

          def text_section
            @epub_inspector.spine_item_parsed(idref)
          end

          def idref
            @spine_node.attribute("idref").try(:value)
          end

          def id
            @spine_node.attribute("id").try(:value)
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
            return title_node.text if title_node
          end

          def guess_name_from_title
            title = text_section.xpath("//title")
            return title.text if title
          end

          def text_section_resource_path
            node = @epub_inspector.rendition_source_node_by_id(idref)
            value = node.attribute("href").try(:value)
            @epub_inspector.rendition_href_to_path(value)
          end

          def guess_name_from_toc
            @epub_inspector.toc_inspector.toc_label_for_cont_doc(
              text_section_resource_path
            )
          end

          def toc?
            toc_page = guess_toc_page_from_landmarks
            if toc_page
              return text_section_resource_path == toc_page[:source_path]
            end
            false
          end

          def cover?
            cover_item = @epub_inspector.manifest_cover_node
            if cover_item
              cover_image_resource_path = cover_item.attribute("href")
              results = text_section.css("[src=\"#{cover_image_resource_path}\"]")
              return !results.empty?
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
end
