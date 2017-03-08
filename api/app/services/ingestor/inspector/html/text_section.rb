require "digest"
require "redcarpet"

module Ingestor
  module Inspector
    module HTML
      # Inspects HTML text sections
      module TextSection
        def initialize(section_path, html_inspector)
          @section_path = section_path
          @html_inspector = html_inspector
        end

        def source_identifier
          Digest::MD5.hexdigest(@section_path)
        end

        def name
          basename.titleize
        end

        def basename
          File.basename(@section_path, ".*")
        end

        def source_path
          @html_inspector.relative_path(@section_path)
        end

        def ingestion_source(text)
          text.ingestion_sources.find_by(source_path: source_path.to_s)
        end

        def source_body
          @html_inspector.get_contents_from_path(@section_path).at("//body").to_html
        end

        def kind
          ::TextSection::KIND_SECTION
        end
      end
    end
  end
end
