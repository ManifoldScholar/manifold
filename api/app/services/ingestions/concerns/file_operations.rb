module Ingestions
  module Concerns
    # This class provides a set of file operations used during the ingestion process.
    # It allows us to perform operations by providing paths relative to the working
    # ingestion root dir.
    module FileOperations
      extend ActiveSupport::Concern

      WORKING_DIR_BASE = Rails.root.join(
        "tmp",
        Rails.env.test? ? "ingestion-test#{ENV['TEST_ENV_NUMBER']}" : "ingestion"
      )

      EXTRACTION_REJECTION_PATTERNS = {
        directory: {
          hidden: ".*?"
        },
        file: {
          hidden: ".*",
          tmp: "~*"
        }
      }.with_indifferent_access.freeze

      def update_working_dirs(path, filename = nil)
        if extractable? path
          extract path, source_root
        else
          copy path, source_root, rename_to: filename
        end
      end

      def teardown
        FileUtils.rm_rf(root_path)
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

      def write_build_file(filename, contents)
        path = File.join("build", filename)
        dir_path = File.dirname(abs(path))
        FileUtils.mkdir_p(dir_path) unless File.directory?(dir_path)
        write path, contents
        path
      end

      def dir?(rel_path)
        file_operation(:directory?, rel_path)
      end

      def abs(rel_path)
        File.join(root_path, rel_path)
      end

      def source_path_for_file(filename, exts)
        Dir.glob("#{source_root}/#{filename}.{#{exts.join(',')}}").first
      end

      def rel_path_without_ext(rel_path, path_from = source_root)
        path = rel(abs(rel_path), path_from)
        path.split(".").first
      end

      def rel_path_for_file(filename, exts)
        file = source_path_for_file filename, exts
        return nil unless file.present?

        rel file
      end

      def rel(abs_path_to, path_from = root_path)
        Pathname.new(abs_path_to).relative_path_from(Pathname.new(path_from)).to_s
      end

      def relativize_ingestion_path(source, path)
        abs_src = Pathname.new(abs(source))
        abs_path = Pathname.new(abs(path))
        abs_path.relative_path_from(abs_src.dirname).to_s
      end

      def derelativize_ingestion_path(source, path)
        return path if url?(path)
        return path if Pathname.new("path").absolute?

        rel(File.expand_path(File.join(root_path, File.dirname(source), path)))
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

      def source_root
        source_root_dir? ? top_level_entities[:dirs].first : source_root_path
      end

      def build_root
        build_root_path
      end

      def sources
        Dir.glob(File.join(source_root, "**", "*"))
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

      def ensure_dir(dir)
        path = Pathname.new(dir)
        absolute = path.absolute?
        abs_dir = absolute ? dir : abs(dir)
        validate_path(abs_dir)
        FileUtils.mkdir_p(abs_dir) unless File.exist?(abs_dir)
        abs_dir
      end

      protected

      def file_operation(msg, rel_path, args = [])
        path = abs(rel_path)
        validate_path(path)
        args.unshift(path)
        File.send(msg, *args)
      rescue Errno::ENOENT
        file_not_found
      end

      def validate_path(abs_path)
        path = Pathname.new(abs_path)
        raise IngestionError, "Ingestion path must be absolute: #{path}" unless path.absolute?
        raise IngestionError, "Ingestion path not inside of root: #{path}" unless path.to_s.start_with? root_path
      end

      def ensure_root
        FileUtils.mkdir_p(root_path) unless File.exist?(root_path)
      end

      def source_root_path
        File.join(root_path, "source")
      end

      def build_root_path
        File.join(root_path, "build")
      end

      def ensure_working_dirs
        FileUtils.mkdir_p(source_root_path) unless File.exist?(source_root_path)
        FileUtils.mkdir_p(build_root_path) unless File.exist?(build_root_path)
      end

      def reject_extracted?(zip_path)
        dirname = zip_path.dirname
        basename = zip_path.basename

        reject_extracted_part?(dirname, type: :directory) ||
          reject_extracted_part?(basename, type: :file)
      end

      def reject_extracted_part?(path_part, type:)
        patterns = EXTRACTION_REJECTION_PATTERNS.fetch(type)

        patterns.any? do |(_reason, pattern)|
          path_part.fnmatch pattern
        end
      end

      def extract(path = source_path, extract_path = root_path)
        extract_path = Pathname.new(extract_path)

        Zip::File.open(path) do |zip_file|
          zip_file.each do |f|
            zip_path = Pathname.new(f.name).cleanpath
            next if reject_extracted?(zip_path)

            target_file = extract_path.join zip_path
            target_path = target_file.dirname
            next if target_file.exist?

            target_path.mkpath
            zip_file.extract(f, target_file.to_s)
            target_file.chmod(0o760)
          end
        end
        logger.debug("Unzipped archive to temporary directory: #{extract_path}")
      end

      def source_root_dir?(path = source_root_path)
        entities = top_level_entities(path)
        entities[:dirs].count == 1 && entities[:files].count.zero?
      end

      def top_level_entities(path = source_root_path)
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
        %w(zip epub).any? do |ext|
          extension(path)&.downcase&.include? ext
        end
      end

      def copy(path = source_path, dest_path = root_path, rename_to: nil)
        path = Pathname.new(path)
        dest_path = Pathname.new(dest_path)

        if path.file?
          target_path =
            if rename_to.present?
              dest_path.join("#{rename_to}#{path.extname}")
            else
              dest_path.join(path.basename)
            end
          FileUtils.cp path, target_path
        else
          FileUtils.cp_r Pathname.glob(File.join(path, "*")), dest_path
        end
      end

      def file_not_found
        raise IngestionError, "Manifold could not locate one of the source files
            specified.  Make sure all assets referred to are included with the
            source file."
      end
    end
  end
end
