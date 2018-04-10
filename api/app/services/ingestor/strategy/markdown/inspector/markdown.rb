require "json"

module Ingestor
  module Strategy
    module Markdown
      module Inspector
        # Inspects the Markdown document and provides high level information and access to
        # document structure, nodes, etc.
        #
        # @author Zach Davis
        # rubocop: disable Metrics/ClassLength
        class Markdown

          attr_reader :logger, :ingestion

          def initialize(ingestion)
            @ingestion = ingestion
          end

          def unique_id
            isbn || title
          end

          def title
            return nil if book_json["title"].blank?
            book_json["title"]
          end

          def markdown?
            ingestion.file?(book_json_path)
          end

          def date
            book_json["manifold"]["date"]
          end

          def rights
            book_json["manifold"]["rights"]
          end

          def description
            book_json["description"]
          end

          def language
            return nil if book_json["language"].blank?
            book_json["language"]
          end

          def author
            return nil if book_json["author"].blank?
            book_json["author"]
          end

          def ingestion_source_inspectors
            klass = ::Ingestor::Strategy::Markdown::Inspector::IngestionSource
            ingestion_sources.map do |source|
              klass.new(source, ingestion)
            end
          end

          def start_section_identifier
            nil
          end

          def stylesheet?
            ingestion.file?(stylesheet_path)
          end

          def stylesheet_inspectors
            klass = ::Ingestor::Strategy::Markdown::Inspector::Stylesheet
            [klass.new(stylesheet_path, ingestion)]
          end

          def text_section_inspectors
            ingestion_source_paths.select { |p| File.extname(p) == ".md" }.map do |path|
              klass = ::Ingestor::Strategy::Markdown::Inspector::TextSection
              klass.new(path, ingestion, summary_path)
            end
          end

          def spine_source_ids
            klass = ::Ingestor::Strategy::Markdown::Inspector::TextSection
            spine_list.map do |item|
              klass.new(item, ingestion, summary_path).source_identifier
            end
          end

          def summary_path
            "/SUMMARY.md"
          end

          protected

          def spine_list
            list = []
            ingestion.readlines(summary_path).each do |line|
              next unless line.strip.start_with?("*", "-")
              path = clean_line(line)
              next unless ingestion.file?(path)
              list << path
            end
            list
          end

          def clean_line(line)
            line.gsub(/\s+/, "")[1..-1].gsub(/\[.*\]/, "").delete("()")
          end

          def stylesheet_path
            "styles/website.css"
          end

          def isbn
            return nil if book_json["isbn"].blank?
            book_json["isbn"]
          end

          def book_json_path
            "/book.json"
          end

          def cover_path
            "/cover.jpg"
          end

          def cover
            ingestion.open(cover_path)
          end

          def book_json
            book_json = ingestion.read(book_json_path)
            JSON.parse(book_json)
          end

          def ingestion_source_paths
            abs_sources = Dir.glob("#{ingestion.root}/**/*").reject do |path|
              File.directory?(path) || File.zero?(path)
            end
            abs_sources.map! { |s| ingestion.rel(s) }
          end

          def ingestion_sources
            allowed = Regexp.union(allowed_file_types)
            sources = ingestion_source_paths.reject do |path|
              next true unless File.extname(path).match(allowed)
              false
            end
            sources
          end

          def allowed_file_types
            Rails.configuration.manifold.attachments.validations.resource.allowed_ext
          end

        end
        # rubocop: enable Metrics/ClassLength
      end
    end
  end
end
