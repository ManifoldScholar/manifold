require "zip"
require "securerandom"
require "fileutils"

module Ingestor
  # The <tt>Ingestion</tt> class represents a single text ingestion run. It stores the
  # ingestion text, source_path, basename, extension, and a logger instance. It has no
  # functionality of its own, rather it simplifies sharing information about the current
  # ingestion between the various classes that make up an ingestion strategy.
  #
  # @author Zach Davis
  class Ingestion

    attr_accessor :logger, :text, :identifier, :source_path

    WORKING_DIR_BASE = Rails.root.join("tmp", "ingestion")

    def initialize(source_path, creator, logger = NullLogger.new)
      @source_path = source_path
      @identifier = SecureRandom.uuid
      @text ||= Text.create(creator: creator)
      @logger = logger
      update_working_dir(source_path)
    end

    def update_working_dir(path)
      ensure_root
      extractable?(path) ? extract(path) : copy(path)
    end

    def teardown
      FileUtils.rm_rf(root)
    end

    def open(rel_path, options = "r")
      file_operation(:open, rel_path, [options])
    end

    def read(rel_path)
      # rubocop:disable Security/Open
      # We're not calling Kernel.open, but Rubocop thinks we are.
      open(rel_path).read
      # rubocop:enable Security/Open
    end

    def delete(rel_path)
      file_operation(:delete, rel_path)
    end

    def readlines(rel_path)
      file_operation(:readlines, rel_path)
    end

    def file?(rel_path)
      file_operation(:file?, rel_path)
    end

    def write(rel_path, contents)
      file_operation(:write, rel_path, [contents])
    end

    def write_tmp(name, ext, contents = nil, url: nil)
      tmp = Tempfile.new([name, ".#{ext}"])
      tmp.close
      if url.present?
        fetch_and_write(url, tmp.path)
      else
        File.open(tmp.path, "wb") do |f|
          f.write(contents)
        end
      end
      [tmp, tmp.path]
    end

    def fetch_and_write(uri, path)
      IO.copy_stream(URI(uri).open, path)
    end

    def dir?(rel_path)
      file_operation(:directory?, rel_path)
    end

    def abs(rel_path)
      File.join(root, rel_path)
    end

    def ingestion_path_for_file(filename, exts)
      Dir.glob("#{abs(filename)}.{#{exts.join(',')}}").first
    end

    def rel_path_for_file(filename, exts)
      file = ingestion_path_for_file filename, exts
      return nil unless file.present?
      rel file
    end

    def rel(abs_path)
      Pathname.new(abs_path).relative_path_from(Pathname.new(root)).to_s
    end

    def relativize_ingestion_path(source, path)
      abs_src = Pathname.new(abs(source))
      abs_path = Pathname.new(abs(path))
      abs_path.relative_path_from(abs_src.dirname).to_s
    end

    def derelativize_ingestion_path(source, path)
      return path if url?(path)
      return path if Pathname.new("path").absolute?
      rel(File.expand_path(File.join(root, File.dirname(source), path)))
    end

    def basename(path = source_path)
      File.basename(path)
    end

    def extension(path = source_path)
      return nil unless source?(path)
      File.extname(basename(path)).split(".").last
    end

    def root_path
      File.join(WORKING_DIR_BASE, identifier)
    end

    def root
      root_dir? ? top_level_entities[:dirs].first : root_path
    end

    def sources
      Dir.glob(File.join(root, "**", "*"))
         .reject { |path| File.directory?(path) }
         .map { |path| rel(path) }
    end

    def source_url(path = source_path)
      return nil unless url?
      path
    end

    def url?(path = source_path)
      path.to_s.start_with?("http://", "https://")
    end

    protected

    def file_operation(msg, rel_path, args = [])
      path = abs(rel_path)
      validate_path(path)
      args.unshift(path)
      File.send(msg, *args)
    end

    def validate_path(abs_path)
      path = Pathname.new(abs_path)
      raise "Ingestion path must be absolute: #{path}" unless path.absolute?
      raise "Ingestion path not inside of root: #{path}" unless path.to_s.start_with? root
    end

    def ensure_root
      FileUtils.mkdir_p(root) unless File.exist?(root)
    end

    def extract(path = source_path)
      Zip::File.open(path) do |zip_file|
        zip_file.each do |f|
          fpath = File.join(root_path, f.name)
          FileUtils.mkdir_p(File.dirname(fpath)) unless root_dir?
          zip_file.extract(f, fpath) unless File.exist?(fpath)
        end
      end
      logger.debug("Unzipped archive to temporary directory: #{root}")
    end

    def root_dir?(path = root_path)
      entities = top_level_entities(path)
      entities[:dirs].count == 1 && entities[:files].count.zero?
    end

    def top_level_entities(path = root_path)
      reject = /(^\..*|^_.*)/
      entities = Dir.glob(File.join(path, "*"))
                    .reject { |d| File.basename(d).match(reject) }
      files = entities.select { |e| File.file?(e) }
      dirs = entities.select { |e| File.directory?(e) }
      { files: files, dirs: dirs }
    end

    def source?(path = source_path)
      File.file?(path)
    end

    def source_exists?(source = source_path)
      File.exist?(source)
    end

    def extractable?(path = source_path)
      %w(zip epub).include? extension(path)&.downcase
    end

    def copy(path = source_path)
      copy_path = File.file?(path) ? path : File.join(path, "*")
      FileUtils.cp_r(Dir[copy_path], root)
    end

  end
end
