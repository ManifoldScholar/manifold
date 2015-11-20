module Ingestor
  module Strategy
    module EPUB3
      module Creator
        # Creates Manifold TextSections from EPUB3 documents.
        #
        # @author Zach Davis
        class TextSections < BaseCreator
          DEFAULT_ATTRIBUTES = {
          }

          def create(nodes, epub_inspector, text, existing_text_sections = nil)
            text_sections = nodes.each_with_index.map do |node, _index|
              node_inspector, section_inspector = inspectors(node, epub_inspector)
              attr = attributes(node_inspector, section_inspector, text)
              attr = defaults(DEFAULT_ATTRIBUTES, attr)
              existing_section = check_for_existing(
                existing_text_sections,
                source_identifier: attr[:source_identifier])
              section = existing_section || TextSection.create(attr)
              log(node_inspector, section)
              section
            end
            text_sections
          end

          private

          def log(node_inspector, section)
            info "services.ingestor.strategy.epub3.log.section_name",
                 id: node_inspector.idref, name: section.name
            info "services.ingestor.strategy.epub3.log.section_kind",
                 id: node_inspector.idref, kind: section.kind
          end

          def inspectors(node, epub_inspector)
            node_inspector = Inspector::SpineItem.new(node)
            contdoc_xml = epub_inspector.spine_item_xml(node_inspector.idref)
            section_inspector = Inspector::ContDoc.new(contdoc_xml,
                                                       node,
                                                       epub_inspector)
            [node_inspector, section_inspector]
          end

          def attributes(node_inspector, section_inspector, text)
            resource = text
                       .find_ingestion_source_by_identifier(node_inspector.idref).resource
            {
              source_identifier: node_inspector.idref,
              name: section_inspector.guess_name,
              source_body:  section_inspector.body,
              kind: section_inspector.kind,
              resource: resource
            }
          end
        end
      end
    end
  end
end
