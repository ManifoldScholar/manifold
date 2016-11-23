require "fileutils"
require "zip"
require "memoist"
require "uri"
require "open-uri"
require "json"
require "pathname"

module Ingestor
  module Strategy
    module Gitbook
      module Inspector
        # Inspects the Gitbook document and provides high level information and access to
        # document structure, nodes, etc.
        #
        # @author Zach Davis
        # rubocop: disable Metrics/ClassLength
        class Gitbook

          extend Memoist
          include Ingestor::Loggable
          include Ingestor::Inspector::Helpers
          attr_reader :logger

          def initialize(gitbook_path, logger = nil)
            @gitbook_path = gitbook_path
            @logger = logger
          end

          def log(level, msg)
            @logger.send(level, msg) if @logger
          end

          def gitbook?
            # TODO: True if book.json exists
            true
          end

          def start_section_identifier
            nil
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

          def isbn
            return nil if book_json["isbn"].blank?
            book_json["isbn"]
          end

          def title
            return nil if book_json["title"].blank?
            book_json["title"]
          end

          def unique_id
            isbn || title
          end

          def language
            return nil if book_json["language"].blank?
            book_json["language"]
          end

          def author
            return nil if book_json["author"].blank?
            book_json["author"]
          end

          def book_json_path
            "#{@gitbook_path}/book.json"
          end

          def summary_path
            "#{@gitbook_path}/SUMMARY.md"
          end

          def book_json
            book_json = File.read(book_json_path)
            JSON.parse(book_json)
          end
          memoize :book_json

          def allowed_file_types
            # rubocop:disable Metrics/LineLength
            Rails.application.config.x.api[:attachments][:validations][:resource][:allowed_ext]
            # rubocop:enable Metrics/LineLength
          end
          memoize :allowed_file_types

          def ingestion_source_paths
            Dir.glob(File.join(@gitbook_path, "**", "*")).reject do |path|
              File.directory?(path)
            end
          end
          memoize :ingestion_source_paths

          def ingestion_sources
            allowed = Regexp.union(allowed_file_types)
            sources = ingestion_source_paths.reject do |path|
              next true unless File.extname(path).match(allowed)
              false
            end
            (ingestion_source_paths - sources).each do |path|
              warn "services.ingestor.strategy.gitbook.log.skipping_source", path: path
            end
            sources
          end

          def ingestion_source_inspectors
            ingestion_sources.map do |source|
              ::Ingestor::Strategy::Gitbook::Inspector::IngestionSource.new(source, self)
            end
          end

          def stylesheet?
            File.file?(stylesheet_path)
          end

          def stylesheet_path
            File.join(@gitbook_path, "styles", "website.css")
          end

          def text_section_inspectors
            ingestion_source_paths.reject { |p| File.extname(p) != ".md" }.map do |path|
              ::Ingestor::Strategy::Gitbook::Inspector::TextSection.new(path, self)
            end
          end

          def stylesheet_inspectors
            [
              ::Ingestor::Strategy::Gitbook::Inspector::Stylesheet.new(
                stylesheet_path,
                self
              )
            ]
          end

          def cover_path
            File.join(@gitbook_path, "styles", "cover.jpg")
          end

          def cover
            get_source_file(cover_path) if File.file?(cover_path)
          end

          def relative_path(path)
            second = Pathname.new(path)
            first = Pathname.new(@gitbook_path)
            second.relative_path_from first
          end

        end
      end
    end
  end
end
