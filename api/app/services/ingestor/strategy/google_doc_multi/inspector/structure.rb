module Ingestor
  module Strategy
    module GoogleDocMulti
      module Inspector
        # Inspects Google Doc structures
        class Structure < ::Ingestor::Inspector::StructureInspector

          def initialize(google_doc_inspector)
            @google_doc_inspector = google_doc_inspector
            @ingestion = @google_doc_inspector.ingestion
          end

          def toc
            @google_doc_inspector.toc.map { |item| make_structure_item item }
          end

          def landmarks
            []
          end

          def page_list
            []
          end

          protected

          def make_structure_item(item)
            label = item["title"].strip
            source_path = get_source_path item["url"]
            children = item["children"]
            {}.with_indifferent_access.tap do |out|
              out[:label] = label
              out[:source_path] = source_path
              if children.present?
                out[:children] = children.map { |child| make_structure_item child }
              end
            end
          end

          def get_source_path(url)
            identifier = Digest::MD5.hexdigest url
            source_map.dig(identifier, :source_path)
          end

          def source_map
            @google_doc_inspector.source_map
          end

        end
      end
    end
  end
end
