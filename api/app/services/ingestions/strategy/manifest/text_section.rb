require "memoist"

module Ingestions
  module Strategy
    module Manifest
      # Inspects epub for a single text section
      class TextSection

        def initialize(strategy, source, ingestion_sources, position)
          @source = source
          @context = strategy.context
          @inspector = strategy.inspector
          @ingestion_sources = ingestion_sources
          @position = position
        end

        def attributes
          {
            source_identifier: source_identifier,
            name: name,
            kind: kind,
            position: @position
          }
        end

        def source_identifier
          Digest::MD5.hexdigest source_path
        end

        def source_path
          @source[:source_path]
        end

        def path_without_ext
          source_path.split(".").first
        end

        def basename
          File.basename(ingestion_source[:source_path], ".*")
        end

        def kind
          ::TextSection::KIND_SECTION
        end

        def raw_html
          @context.read("build/#{path_without_ext}.html")
        end

        protected

        def name
          @source["label"] ||
            dublin_core_metadata("title") ||
            first_tag_content("title") ||
            basename
        end

        def section_parsed
          Nokogiri::HTML(raw_html, nil)
        end

        def ingestion_source
          @ingestion_sources.detect do |source|
            source[:source_identifier] == source_identifier
          end
        end

        def first_tag_content(tag)
          section_parsed.at("//#{tag}")&.content
        end

        def dublin_core_metadata(name)
          section_parsed.at("//meta[@name=\"#{name}\"]")&.attribute("content")&.value
        end
      end
    end
  end
end
