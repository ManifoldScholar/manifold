require "digest"
require "redcarpet"

module Ingestor
  module Strategy
    module Html
      module Inspector
        # Inspects Word text sections
        class TextSection < ::Ingestor::Inspector::TextSectionInspector

          DEFAULT_ATTRIBUTES = {}.freeze

          def initialize(rel_path, ingestion)
            @rel_path = rel_path
            @ingestion = ingestion
          end

          def source_identifier
            Digest::MD5.hexdigest(rel_path)
          end

          def name
            basename.titleize
          end

          def basename
            File.basename(rel_path, ".*")
          end

          def ingestion_source(text)
            text.ingestion_sources.find_by(source_path: rel_path)
          end

          def source_body
            contents = Nokogiri::HTML(ingestion.open(rel_path), nil, "utf-8")
            body = contents.at("//body").to_html
            body = body.mb_chars.tidy_bytes unless body.valid_encoding?
            body
          end

          def kind
            ::TextSection::KIND_SECTION
          end

          def create(inspectors, current_sections = nil)
            sections = inspectors.each_with_index.map do |inspector, index|
              extant_section = find_in_set(current_sections, compare_attr(inspector))
              section = extant_section || ingestion.text.text_sections.new
              section.attributes = attributes_with_defaults(inspector, index: index)
              report(section)
              section
            end
            sections
          end

          private

          attr_reader :ingestion

          attr_reader :rel_path

          def report(sections)
            if sections.new_record?
              info "services.ingestor.creator.log.new_section", name: sections.name
            else
              info "services.ingestor.creator.log.updated_section", name: sections.name
            end
          end

          def compare_attr(inspector)
            {
              source_identifier: inspector.source_identifier
            }
          end

          def attributes(inspector, options = {})
            {
              name: inspector.name,
              source_body: inspector.source_body,
              ingestion_source: inspector.ingestion_source(ingestion.text),
              source_identifier: inspector.source_identifier,
              position: options[:index],
              kind: inspector.kind
            }
          end
        end
      end
    end
  end
end
