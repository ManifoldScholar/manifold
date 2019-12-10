module Packaging
  module BagItSpec
    module Compilation
      # Create a zip file and add all the bagit files.
      class BuildArchive
        include Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Packaging::BagItSpec::Context] :context
        # @return [Tempfile]
        def call(state)
          build_path = state[:context].build_path

          file = Tempfile.open(["bagit", ".zip"], encoding: "ascii-8bit")

          Zip::File.open(file, Zip::File::CREATE) do |zipfile|
            build_path.find do |path|
              next if path == build_path || path.basename.fnmatch(".*")

              relative_path = path.relative_path_from build_path

              if path.directory?
                zipfile.mkdir relative_path
              elsif path.file?
                zipfile.add relative_path, path
              end
            end
          end

          return file
        end
      end
    end
  end
end
