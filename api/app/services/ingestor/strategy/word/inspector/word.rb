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

          def initialize(path, logger = nil)
            @word_path = File.expand_path(path)
            @zip_path = File.join(@word_path, "#{basename}.zip")
            @logger = logger
          end

          def extract_zip(zip_path)
            remove_tmp
            FileUtils.mkdir(tmp_path)
            Zip::File.open(zip_path) do |zip_file|
              zip_file.each do |f|
                fpath = File.join(tmp_path, f.name)
                zip_file.extract(f, fpath) unless File.exist?(fpath)
              end
            end
            @logger.debug("Unzipped archive to temporary directory")
          end

          def remove_tmp
            FileUtils.rm_rf(tmp_path, secure: true) if File.directory?(tmp_path)
          end

          def basename
            File.basename(@word_path, ".*")
          end

          def tmp_path
            "tmp/#{basename}"
          end

          def resource_dir
            "#{tmp_path}/#{basename}.fld"
          end

          def html_file
            "#{tmp_path}/#{basename}.html"
          end

          # returns true if file ends in html and has a matching .fld dir
          def word_doc?
            @logger.debug(@word_path)
            File.file?(@zip_path) ? extract_zip(@zip_path) : false
            File.file?(html_file) && File.directory?(resource_dir)
          end

          # returns md5 hash of file contents
          def unique_id
            Digest::MD5.hexdigest(File.read(html_file))
          end

          def language
            "en"
          end

          def date
            File.mtime(html_file)
          end

          def title
            File.basename(html_file, ".*")
          end

          def rights
            ""
          end

          def description
            ""
          end

          def allowed_file_types
            # rubocop:disable Metrics/LineLength
            Rails.application.config.x.api[:attachments][:validations][:resource][:allowed_ext]
            # rubocop:enable Metrics/LineLength
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
            @logger.debug(sources)
            sources
          end

          def ingestion_source_inspectors
            ingestion_sources.map do |source|
              ::Ingestor::Strategy::Word::Inspector::IngestionSource.new(source, self)
            end
          end

          def relative_path(path)
            Pathname.new(path)
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
            doc = Nokogiri::HTML(File.open(html_file), nil, "utf-8")
            doc.at("//style").to_html
          end

          def text_section_inspectors
            name = "#{basename}.html"
            ingestion_source_paths.reject { |p| File.basename(p) != name }.map do |path|
              ::Ingestor::Strategy::Word::Inspector::TextSection.new(path, self)
            end
          end

          def cover
            nil
          end

          def toc
            []
          end

          def landmarks
            []
          end

          def page_list
            []
          end

          def start_section_identifier
            nil
          end

        end
      end
    end
  end
end
