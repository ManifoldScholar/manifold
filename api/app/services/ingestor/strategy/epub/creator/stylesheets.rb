module Ingestor
  module Strategy
    module EPUB
      module Creator
        # Creates Manifold Makers from an EPUB document metadata.
        #
        # @author Zach Davis
        class Stylesheets < BaseCreator
          DEFAULT_ATTRIBUTES = {
          }

          def create(nodes, path, epub_inspector, text, existing = nil)
            style_nodes = nodes.select do |node|
              Inspector::ManifestItem.new(node).stylesheet?
            end
            models = style_nodes.each_with_index.map do |node, _index|
              node_inspector = Inspector::ManifestItem.new(node)
              create_stylesheet(node_inspector, path, epub_inspector, text, existing)
            end
            models
          end

          private

          def create_stylesheet(node_inspector, path, epub_inspector, text, existing)
            attr = defaults(DEFAULT_ATTRIBUTES,
                            attributes(node_inspector, path, epub_inspector, text))
            compare = { source_identifier: attr[:source_identifier] }
            existing_stylesheet = check_for_existing(existing, compare)
            stylesheet = existing_stylesheet || Stylesheet.create(attr)
            stylesheet.update_attributes(attr)
            stylesheet
          end

          def attributes(node_inspector, path, epub_inspector, text)
            {
              name: "source/#{path}/#{node_inspector.id}",
              raw_styles: epub_inspector.get_rendition_source(node_inspector.href).string,
              ingestion_source:
                text.find_ingestion_source_by_identifier(node_inspector.id),
              source_identifier: node_inspector.id
            }
          end
        end
      end
    end
  end
end
