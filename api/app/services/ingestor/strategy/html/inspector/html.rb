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
          alias cover nil

          # returns md5 hash of file contents
          def unique_id
            Digest::MD5.hexdigest(index)
          end

          def html_doc?
            index_path.present?
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

          def start_section_identifier
            node = index_node_for "[data-start-section]"
            return nil unless node.present?
            path = node.attributes["href"]&.value
            return nil unless path.present?
            ::Ingestor::Strategy::Html::Inspector::TextSection.new(path,
                                                                   ingestion,
                                                                   self)
                                                              .source_identifier
          end

          def index_node_for(identifier)
            index_parsed.at_css(identifier)
          end

          def ingestion_source_inspectors
            ingestion.sources.map do |source|
              ::Ingestor::Strategy::Html::Inspector::IngestionSource
                .new(source, ingestion)
            end
          end

          def html_ingestion_sources
            ingestion.sources.select do |source|
              %w(.htm .html).include? File.extname(source)
            end
          end

          def stylesheet_inspectors
            filtered_stylesheet_chunks.map do |chunk|
              ::Ingestor::Strategy::Html::Inspector::Stylesheet.new(chunk, ingestion)
            end
          end

          def text_section_inspectors
            html_ingestion_sources.map do |path|
              ::Ingestor::Strategy::Html::Inspector::TextSection.new(path,
                                                                     ingestion,
                                                                     self)
            end
          end

          def spine_source_ids
            text_section_inspectors.map(&:source_identifier)
          end

          def index
            ingestion.read(index_path)
          end

          # We look for a summary file, index, or take the first file.
          def index_path
            ingestion_path_for_file("summary") ||
              ingestion_path_for_file("index") ||
              ingestion_path_for_file("*")
          end

          def index_parsed
            file_parsed index_path
          end

          def first_tag_content(tag, path = index_path)
            return unless index_path.present?
            file_parsed(path).at("//#{tag}")&.content
          end

          def dublin_core_metadata(name, path = index_path)
            return unless index_path.present?
            file_parsed(path).at("//meta[@name=\"#{name}\"]")&.attribute("content")&.value
          end

          protected

          def ingestion_path_for_file(filename)
            ingestion.rel_path_for_file filename, %w(htm html)
          end

          def file_parsed(file_path)
            Nokogiri::HTML(ingestion.open(file_path), nil)
          end

          def first_tag_attribute_value(tag, attribute)
            index_parsed.at("//#{tag}")&.attribute(attribute)&.value
          end

          def node_to_style_chunk(source_path, node)
            return stylesheet_chunk(node) if node.name == "link"
            return style_chunk(source_path, node) if node.name == "style"
            raise "Invalid style chunk"
          end

          def style_chunk(source_path, node)
            {
              name: "head",
              source_path: source_path,
              styles: node.content
            }
          end

          def stylesheet_chunk(node)
            path = node.attribute("href").value
            {
              name: "stylesheet",
              source_path: path,
              styles: ingestion.read(path)
            }
          end

          # Removes chunks with blank styles or duplicates and assigns position
          def filtered_stylesheet_chunks
            style_chunks.reject { |c| c[:styles].squish.blank? }
                        .uniq { |c| c[:styles].squish }
                        .map.with_index do |chunk, index|
                          chunk.tap do |c|
                            c[:name] = "#{c[:name]}-#{index}"
                            c[:position] = index
                          end
                        end
          end

          def style_chunks
            xpath = "//*[@rel=\"stylesheet\" or @media=\"all\" or @media=\"screen\"] |
                    //style"
            chunks = []

            html_ingestion_sources.each do |source|
              nodes = file_parsed(source).search(xpath)
              chunks << nodes.map do |node|
                node_to_style_chunk(source, node)
              end
            end

            chunks.flatten
          end

        end
      end
    end
  end
end
