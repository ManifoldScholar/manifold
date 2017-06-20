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

    attr_accessor :logger, :text, :identifier

    WORKING_DIR_BASE = Rails.root.join("tmp", "ingestion")

    def initialize(source_path, creator, logger = NullLogger.new)
      @source_path = source_path
      @identifier = SecureRandom.uuid
      @text ||= Text.create(creator: creator)
      @logger = logger
      ensure_root
      copy if source_dir_exists?
      extract if extractable?
    end

    def teardown
      FileUtils.rm_rf(root)
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

    def dir?(rel_path)
      file_operation(:directory?, rel_path)
    end

    def abs(rel_path)
      File.join(root, rel_path)
    end

    def rel(abs_path)
      Pathname.new(abs_path).relative_path_from(Pathname.new(root)).to_s
    end

    def href_to_ingestion_path(source, path)
      return path if Pathname.new("path").absolute?
      rel(File.expand_path(File.join(root, File.dirname(source), path)))
    end

    def basename
      File.basename(source_path)
    end

    def extension
      return nil unless source?
      File.extname(basename).split(".").last
    end

    def root
      File.join(WORKING_DIR_BASE, identifier)
    end

    def sources
      Dir.glob(File.join(root, "**", "*"))
         .reject { |path| File.directory?(path) }
         .map { |path| rel(path) }
    end

    def source_url
      return nil unless url?
      source_path
    end

    def url?
      source_path.to_s.start_with?("http://", "https://")
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

    def extract
      Zip::File.open(source_path) do |zip_file|
        zip_file.each do |f|
          fpath = File.join(root, f.name)
          FileUtils.mkdir_p(File.dirname(fpath))
          zip_file.extract(f, fpath) unless File.exist?(fpath)
        end
      end
      logger.debug("Unzipped archive to temporary directory: #{root}")
    end

    def source?
      File.file?(source_path)
    end

    def source_dir_exists?
      File.directory?(source_path)
    end

    def extractable?
      %w(zip epub).include? extension&.downcase
    end

    def copy
      FileUtils.cp_r(Dir[File.join(source_path, "*")], root)
    end

  end
end
