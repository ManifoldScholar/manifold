require "fileutils"
require "zip"
require "memoist"
require "uri"
require "open-uri"
require "json"
require "pathname"
require "digest/md5"

module Ingestor
  module Strategy
    module Word
      module Inspector
        class Word

          include Ingestor::Loggable
          include Ingestor::Inspector::Helpers
          include Ingestor::Inspector::HTML::HTML
          extend Memoist

          def initialize(path, logger = nil)
            @word_path = File.expand_path(path)
            @html_path = "tmp/#{basename}"
            @logger = logger
          end

          def word_zip_file?(zip_path)
            remove_tmp
            FileUtils.mkdir(@html_path)
            return false unless create_tmp_dir(zip_path)
            return true if html_file && resource_dir
            remove_tmp
            false
          end
          memoize :word_zip_file?

          def create_tmp_dir(zip_path)
            return false unless File.extname(zip_path) == ".zip"
            Zip::File.open(zip_path) do |zip_file|
              zip_file.each do |f|
                fpath = File.join(@html_path, f.name)
                zip_file.extract(f, fpath) unless File.exist?(fpath)
              end
            end
            @logger.debug("Unzipped archive to temporary directory")
          end
          memoize :create_tmp_dir

          def remove_tmp
            FileUtils.rm_rf(@html_path, secure: true) if File.directory?(@html_path)
          end

          def basename
            File.basename(@word_path, ".*")
          end

          def resource_dir
            Dir.glob("#{@html_path}/*.fld").first || false
          end
          memoize :resource_dir

          def html_file
            Dir.glob("#{@html_path}/*.html").first || false
          end
          memoize :html_file

          # returns true if file ends in html and has a matching .fld dir
          def word_doc?
            @logger.debug(@word_path)
            word_zip_file?(@word_path)
          end

          # returns md5 hash of file contents
          def unique_id
            Digest::MD5.hexdigest(@word_path)
          end

          def date
            File.mtime(html_file)
          end

          def title
            basename.titleize
          end

          def ingestion_source_paths
            Dir.glob(File.join(File.dirname(resource_dir), "**", "*")).reject do |path|
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

        end
      end
    end
  end
end
