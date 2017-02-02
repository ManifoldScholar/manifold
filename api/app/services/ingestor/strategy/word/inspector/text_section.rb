require "digest"
require "redcarpet"

module Ingestor
  module Strategy
    module Word
      module Inspector
        # Inspects Word text sections
        class TextSection < ::Ingestor::Inspector::TextSectionInspector

          def initialize(section_path, word_inspector)
            @section_path = section_path
            @word_inspector = word_inspector
          end

          def source_identifier
            Digest::MD5.hexdigest(@section_path)
          end

          # TODO: Determine better name from TOC
          def name
            basename
          end

          def basename
            File.basename(@section_path, ".*")
          end

          def source_path
            @word_inspector.relative_path(@section_path)
          end

          def ingestion_source(text)
            text.ingestion_sources.find_by(source_path: source_path.to_s)
          end

          def source_body
            doc = Nokogiri::HTML(File.open(@section_path), nil, "utf-8")
            doc.at("//body").to_html
          end

          def kind
            return ::TextSection::KIND_NAVIGATION if basename == "SUMMARY"
            ::TextSection::KIND_SECTION
          end

        end
      end
    end
  end
end
