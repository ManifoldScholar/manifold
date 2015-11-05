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

          # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
          def create(nodes, inspector, text)
            text_sections = nodes.each_with_index.map do |node, _index|
              node_inspector = Inspector::SpineItem.new(node)
              contdoc_xml = inspector.spine_item_xml(node_inspector.idref)
              section_inspector = Inspector::ContDoc.new(contdoc_xml, node, inspector)
              attr = defaults(DEFAULT_ATTRIBUTES, attributes(node_inspector,
                                                             section_inspector,
                                                             text))
              section = @existing.find_or_initialize_by(attr)
              info "services.ingestor.strategy.epub3.log.section_name",
                   id: node_inspector.idref, name: section.name
              info "services.ingestor.strategy.epub3.log.section_kind",
                   id: node_inspector.idref, kind: section.kind
              section
            end
            text_sections
          end

          private

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
