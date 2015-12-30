module Ingestor
  module Strategy
    module EPUB
      module Creator
        # Creates Manifold TextSections from EPUB documents.
        #
        # @author Zach Davis
        class TextSections < BaseCreator
          DEFAULT_ATTRIBUTES = {
          }

          def create(nodes, epub_inspector, text, existing_text_sections = nil)
            text_sections = nodes.each_with_index.map do |node, index|
              node_inspector, section_inspector = inspectors(node, epub_inspector)
              attr = attributes(node_inspector, section_inspector, text, index)
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
            debug "services.ingestor.strategy.ePUB.log.section_name",
                 id: node_inspector.idref, name: section.name
            debug "services.ingestor.strategy.ePUB.log.section_kind",
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

          def attributes(node_inspector, section_inspector, text, index)
            body = section_inspector.body
            resource = text
                       .find_ingestion_source_by_identifier(node_inspector.idref).resource
            {
              source_identifier: node_inspector.idref,
              position: index,
              name: section_inspector.guess_name,
              source_body:  body,
              kind: section_inspector.kind,
              resource: resource
            }
          end
        end
      end
    end
  end
end
