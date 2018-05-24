require "digest/md5"

module Ingestor
  module Strategy
    module GoogleDocMulti
      module Inspector
        class GoogleDoc < Ingestor::Strategy::Html::Inspector::Html

          attr_reader :source_map

          def initialize(ingestion, source_map)
            @ingestion = ingestion
            @source_map = source_map
          end

          def unique_id
            Digest::MD5.hexdigest(ingestion.source_path)
          end

          def google_doc?
            manifest_path.present?
          end

          def title
            manifest_meta_tag "title"
          end

          def language
            manifest_meta_tag "language"
          end

          def rights
            manifest_meta_tag "rights"
          end

          def description
            manifest_meta_tag "description"
          end

          def date
            manifest_meta_tag "date"
          end

          def authors
            manifest_meta_tag "authors"
          end

          def text_section_inspectors
            html_ingestion_sources.map do |path|
              ::Ingestor::Strategy::GoogleDocMulti::Inspector::TextSection.new(path,
                                                                               ingestion,
                                                                               self)
            end
          end

          def creator_inspectors
            authors.map do |author|
              ::Ingestor::Strategy::GoogleDocMulti::Inspector::Creator.new(author)
            end
          end

          def start_section_identifier
            section = toc.detect { |item| item["start_section"].present? }
            return nil unless section.present?
            section["url"]
          end

          def manifest_meta_tag(tag)
            manifest_parsed["meta"][tag]
          end

          def toc
            manifest_parsed["toc"]
          end

          def manifest_parsed
            yaml_parsed manifest_path
          end

          # We don't know what the manifest yaml file is called after it is
          # written to the temp dir, so we take the first one.
          def manifest_path
            ingestion.ingestion_path_for_file "*", %w(yml yaml)
          end

          def source_items(array)
            out = []
            array.each do |entry|
              out << { title: entry["title"], url: entry["url"] }
              out << source_items(entry["children"]) if entry["children"].present?
            end

            out.flatten
          end

          protected

          def yaml_parsed(file_path)
            YAML.load_file file_path
          end
        end
      end
    end
  end
end
