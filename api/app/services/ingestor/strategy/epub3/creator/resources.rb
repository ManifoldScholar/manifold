module Ingestor
  module Strategy
    module EPUB3
      module Creator
        # Creates Manifold Resources from an EPUB3 document.
        #
        # @author Zach Davis
        class Resources < BaseCreator
          DEFAULT_ATTRIBUTES = {
            kind: IngestionSource::KIND_PUBLICATION_RESOURCE
          }

          def create(nodes, path, epub_inspector, existing = nil)
            ingestion_sources = nodes.each_with_index.map do |node, _index|
              node_inspector = Inspector::ManifestItem.new(node)
              ingestion_source = create_ingestion_source(node_inspector, existing)
              create_resource(ingestion_source, path, node_inspector, epub_inspector)
              ingestion_source
            end
            ingestion_sources
          end

          private

          def create_resource(ingestion_source, path, node_inspector, epub_inspector)
            resource = ingestion_source.resource || ingestion_source.build_resource
            resource.name = "source/#{path}/#{node_inspector.id}"
            resource.attachment = epub_inspector.get_rendition_source(
              node_inspector.href)
          end

          def create_ingestion_source(node_inspector, existing)
            attr = defaults(DEFAULT_ATTRIBUTES, attributes(node_inspector))
            compare = { source_identifier: attr[:source_identifier] }
            existing_ingestion_source = check_for_existing(existing, compare)
            existing_ingestion_source || IngestionSource.create(attr)
          end

          def attributes(node_inspector)
            {
              source_identifier: node_inspector.id,
              source_path: node_inspector.href,
              kind: node_inspector.kind.presence
            }
          end
        end
      end
    end
  end
end
