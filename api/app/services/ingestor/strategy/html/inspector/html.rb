require "digest/md5"
require "securerandom"

module Ingestor
  module Strategy
    module Html
      module Inspector
        class Html

          attr_reader :ingestion

          def initialize(ingestion)
            @ingestion = ingestion
          end

          def nil(*_args)
            nil
          end
          alias start_section_identifier nil
          alias cover nil

          def empty_collection(*_args)
            []
          end
          alias toc empty_collection
          alias page_list empty_collection
          alias landmarks empty_collection

          # returns md5 hash of file contents
          def unique_id
            Digest::MD5.hexdigest(index)
          end

          def html_doc?
            !index_path.blank?
          end

          def title
            dublin_core_metadata("dc.title") ||
              first_tag_content("title") ||
              ingestion.basename.titleize
          end

          def language
            dublin_core_metadata("dc.language") ||
              first_tag_attribute_value("html", "lang")
          end

          def date
            dublin_core_metadata("dc.date") ||
              index_parsed.at("//meta[@name=\"date\"]")&.attribute("content")&.value
          end

          def rights
            dublin_core_metadata("dc.rights")
          end

          def description
            dublin_core_metadata("dc.description")
          end

          def ingestion_source_inspectors
            ingestion.sources.map do |source|
              ::Ingestor::Strategy::Html::Inspector::IngestionSource
                .new(source, ingestion)
            end
          end

          def stylesheet_inspectors
            style_chunks.map do |chunk|
              ::Ingestor::Strategy::Html::Inspector::Stylesheet.new(chunk, ingestion)
            end
          end

          def text_section_inspectors
            [index_path].map do |path|
              ::Ingestor::Strategy::Html::Inspector::TextSection.new(path, ingestion)
            end
          end

          def spine_source_ids
            text_section_inspectors.map(&:source_identifier)
          end

          protected

          # returns the first html file found in the root
          def index_path
            html_file = Dir.glob("#{ingestion.root}/*.{htm,html}").first
            return nil unless html_file
            ingestion.rel(html_file)
          end

          def index
            ingestion.read(index_path)
          end

          def index_parsed
            Nokogiri::HTML(ingestion.open(index_path), nil, "utf-8")
          end

          def first_tag_attribute_value(tag, attribute)
            index_parsed.at("//#{tag}")&.attribute(attribute)&.value
          end

          def first_tag_content(tag)
            index_parsed.at("//#{tag}")&.content
          end

          def dublin_core_metadata(name)
            index_parsed.at("//meta[@name=\"#{name}\"]")&.attribute("content")&.value
          end

          def node_to_style_chunk(node, index)
            return stylesheet_chunk(node, index) if node.name == "link"
            return style_chunk(node, index) if node.name == "style"
            raise "Invalid style chunk"
          end

          def style_chunk(node, index)
            position = index + 1
            {
              position: position,
              name: "head-#{position}",
              source_path: index_path,
              styles: node.content
            }
          end

          def stylesheet_chunk(node, index)
            path = node.attribute("href").value
            position = index + 1
            {
              position: position,
              name: "stylesheet-#{position}",
              source_path: path,
              styles: ingestion.read(path)
            }
          end

          def style_chunks
            xpath = "//*[@rel=\"stylesheet\" or @media=\"all\" or @media=\"screen\"] |
                    //style"
            nodes = index_parsed.search(xpath)
            nodes.map.with_index { |node, index| node_to_style_chunk(node, index) }
          end

        end
      end
    end
  end
end
