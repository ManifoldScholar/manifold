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
            @tmp_path = "tmp/#{basename}"
            @logger = logger
            @root_path = gitbook_zip_file?(@gitbook_path) ? @tmp_path : @gitbook_path
          end

          def log(level, msg)
            @logger.send(level, msg) if @logger
          end

          def gitbook_zip_file?(zip_path)
            remove_tmp
            FileUtils.mkdir(@tmp_path)
            return false unless create_tmp_dir(zip_path)
            return true if File.file?(File.join(@tmp_path, "book.json"))
            remove_tmp
            false
          end
          memoize :gitbook_zip_file?

          def create_tmp_dir(zip_path)
            return false unless File.extname(zip_path) == ".zip"
            Zip::File.open(zip_path) do |zip_file|
              zip_file.each do |f|
                fpath = File.join(@tmp_path, f.name)
                zip_file.extract(f, fpath) unless File.exist?(fpath)
              end
            end
            @logger.debug("Unzipped archive to temporary directory")
          end
          memoize :create_tmp_dir

          def remove_tmp
            FileUtils.rm_rf(@tmp_path, secure: true) if File.directory?(@tmp_path)
          end

          def basename
            File.basename(@gitbook_path, ".*")
          end

          def gitbook?
            @logger.debug(@gitbook_path)
            gitbook_zip_file?(@gitbook_path) || File.file?(book_json_path)
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
            "#{@root_path}/book.json"
          end

          def summary_path
            "#{@root_path}/SUMMARY.md"
          end

          def spine_list
            list = []
            File.readlines(summary_path).each do |line|
              next unless line.strip.start_with?("*", "-")
              path = File.join(@root_path, clean_line(line))
              next unless File.file?(path)
              list << path
            end
            list
          end
          memoize :spine_list

          def clean_line(line)
            line.gsub(/\s+/, "")[1..-1].gsub(/\[.*\]/, "").delete("()")
          end

          def spine_source_ids
            spine_list.map do |item|
              ::Ingestor::Strategy::Gitbook::Inspector::TextSection.new(item,
                                                                        self,
                                                                        summary_path)
                                                                   .source_identifier
            end
          end

          def book_json
            book_json = File.read(book_json_path)
            JSON.parse(book_json)
          end
          memoize :book_json

          def allowed_file_types
            Rails.configuration.manifold.attachments.validations.resource.allowed_ext
          end
          memoize :allowed_file_types

          def ingestion_source_paths
            Dir.glob(File.join(@root_path, "**", "*")).reject do |path|
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
            File.join(@root_path, "styles", "website.css")
          end

          def text_section_inspectors
            ingestion_source_paths.reject { |p| File.extname(p) != ".md" }.map do |path|
              ::Ingestor::Strategy::Gitbook::Inspector::TextSection.new(path,
                                                                        self,
                                                                        summary_path)
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
            File.join(@root_path, "styles", "cover.jpg")
          end

          def cover
            get_source_file(cover_path) if File.file?(cover_path)
          end

          def relative_path(path)
            second = Pathname.new(path)
            first = Pathname.new(@root_path)
            second.relative_path_from first
          end

        end
      end
    end
  end
end
