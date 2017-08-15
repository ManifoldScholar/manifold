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
      copy(path) if source_dir_exists?(path)
      extract(path) if extractable?(path)
    end

    def teardown
      # FileUtils.rm_rf(root)
    end

    def open(rel_path, options = "r")
      file_operation(:open, rel_path, [options])
    end

    def read(rel_path)
      open(rel_path).read
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

    def write_tmp(name, ext, contents)
      tmp = Tempfile.new([name, ".#{ext}"])
      tmp.close
      File.open(tmp.path, "wb") do |f|
        f.write(contents)
      end
      [tmp, tmp.path]
    end

    def dir?(rel_path)
      file_operation(:directory?, rel_path)
    end

    def abs(rel_path)
      File.join(root, rel_path)
    end

    def rel(abs_path)
      Pathname.new(abs_path).relative_path_from(Pathname.new(root)).to_s
    end

    def relativize_ingestion_path(source, path)
      abs_src = Pathname.new(abs(source))
      abs_path = Pathname.new(abs(path))
      abs_path.relative_path_from(abs_src.dirname).to_s
    end

    def href_to_ingestion_path(source, path)
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

    def root
      File.join(WORKING_DIR_BASE, identifier)
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

    attr_reader :source_path

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
          fpath = File.join(root, f.name)
          FileUtils.mkdir_p(File.dirname(fpath))
          zip_file.extract(f, fpath) unless File.exist?(fpath)
        end
      end
      logger.debug("Unzipped archive to temporary directory: #{root}")
    end

    def source?(path = source_path)
      File.file?(path)
    end

    def source_dir_exists?(source_dir = source_path)
      File.directory?(source_dir)
    end

    def extractable?(path = source_path)
      %w(zip epub).include? extension(path)&.downcase
    end

    def copy(path = source_path)
      FileUtils.cp_r(Dir[File.join(path, "*")], root)
    end

  end
end
