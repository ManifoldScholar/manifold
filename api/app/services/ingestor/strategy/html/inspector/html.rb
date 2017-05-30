require "fileutils"
require "zip"
require "memoist"
require "uri"
require "open-uri"
require "json"
require "pathname"
require "digest/md5"
require "securerandom"

module Ingestor
  module Strategy
    module Html
      module Inspector
        class Html

          include Ingestor::Loggable
          include Ingestor::Inspector::Helpers
          include Ingestor::Inspector::HTML::HTML
          extend Memoist

          def initialize(path, logger = nil)
            @archive_path = File.expand_path(path)
            @base_name = SecureRandom.hex
            @base_path = Rails.root.join("tmp", "ingestion").to_s
            @extracted_path = File.join(@base_path, @base_name).to_s
            @ready = false
            @logger = logger
          end

          def setup
            return if @ready == true
            FileUtils.mkdir(@extracted_path)
            create_tmp_dir
            @ready = true
          end

          def teardown
            remove_tmp
          end

          # returns md5 hash of file contents
          def unique_id
            Digest::MD5.hexdigest(@archive_path)
          end

          # returns true if file ends in html and has a matching .fld dir
          def html_doc?
            !html_file.blank?
          end

          def date
            return nil unless html_file
            File.mtime(html_file)
          end

          def title
            basename.titleize
          end

          def ingestion_source_paths
            Dir.glob(File.join(File.dirname(@extracted_path), "**", "*")).reject do |path|
              File.directory?(path)
            end
          end

          def ingestion_sources
            allowed = Regexp.union(allowed_file_types)
            sources = ingestion_source_paths.reject do |path|
              next true unless File.extname(path).match(allowed)
              false
            end
            (ingestion_source_paths - sources).each do |path|
              warn "services.ingestor.strategy.word.log.skipping_source", path: path
            end
            sources
          end

          def ingestion_source_inspectors
            ingestion_sources.map do |source|
              ::Ingestor::Strategy::Word::Inspector::IngestionSource.new(source, self)
            end
          end

          def stylesheet_inspectors
            [
              ::Ingestor::Strategy::Word::Inspector::Stylesheet.new(
                stylesheet,
                self
              )
            ]
          end

          def stylesheet
            get_contents_from_path(html_file).at("//style").to_html
          end

          def spine_source_ids
            [html_file].map do |item|
              ::Ingestor::Strategy::Word::Inspector::TextSection.new(item, self)
                                                                .source_identifier
            end
          end

          def text_section_inspectors
            [html_file].map do |path|
              ::Ingestor::Strategy::Word::Inspector::TextSection.new(path, self)
            end
          end

          def basename
            File.basename(@archive_path, ".*")
          end

          protected

          def remove_tmp
            opts = { secure: true }
            FileUtils.rm_rf(@extracted_path, opts) if File.directory?(@extracted_path)
          end

          def create_tmp_dir
            return false unless File.extname(@archive_path) == ".zip"
            Zip::File.open(@archive_path) do |zip_file|
              zip_file.each do |f|
                fpath = File.join(@extracted_path, f.name)
                zip_file.extract(f, fpath) unless File.exist?(fpath)
              end
            end
            @logger.debug("Unzipped archive to temporary directory")
            true
          end
          memoize :create_tmp_dir

          def html_file
            Dir.glob("#{@extracted_path}/*.{htm,html}").first
          end
          memoize :html_file

        end
      end
    end
  end
end
