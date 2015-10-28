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

          def create(nodes, path, inspector)
            ingestion_sources = nodes.each_with_index.map do |node, _index|
              node_inspector = Inspector::ManifestItem.new(node)
              attr = defaults(DEFAULT_ATTRIBUTES, attributes(node_inspector))
              ingestion_source = @existing.find_or_initialize_by(attr)
              resource = ingestion_source.resource || ingestion_source.build_resource
              resource.name = "source/#{path}/#{node_inspector.id}"
              resource.attachment = inspector.get_rendition_source(node_inspector.href)
              ingestion_source
            end
            ingestion_sources
          end

          private

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
