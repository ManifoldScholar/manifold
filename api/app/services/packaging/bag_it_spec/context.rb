module Packaging
  module BagItSpec
    # A context object that wraps around a {Project} for BagIt archiving.
    class Context
      extend Dry::Initializer
      extend Memoist

      include Packaging::BagItSpec::BuildsEntries
      include Packaging::BagItSpec::Import[compilation_version: "compilation.version", manifold_version: "manifold.version"]

      param :project, Types.Instance(Project)

      option :tmp_root, default: proc { Packaging::BagItSpec::Compilation::TMP_ROOT }, type: Types::EXISTING_PATH

      delegate :id, to: :project, prefix: true
      delegate :resources, :texts, to: :project

      # @!attribute [r] bag
      # @return [Bagit::Bag]
      memoize def bag
        ::BagIt::Bag.new build_path.to_s
      end

      # @!attribute [r] build_path
      # @return [Pathname]
      memoize def build_path
        Pathname.new Dir.mktmpdir(["project", project_id], tmp_root)
      end

      # @!attribute [r] global_id
      # @return [Pathname]
      memoize def global_id
        project.to_global_id.to_s
      end

      # @!attribute [r] project_metadata
      # @see Packaging::Preservation::ExportProjectMetadata
      # @return [ActiveSupport::HashWithIndifferentAccess]
      memoize def project_metadata
        Packaging::Preservation::ExportProjectMetadata.run! project: project
      end

      # @!attribute [r] published_texts
      # An array of published {Text}s
      # @return [<Text>]
      memoize def published_texts
        texts.published(true).to_a
      end

      # @!attribute [r] all_texts
      # An array of {Text}s
      # @return [<Text>]
      memoize def all_texts
        texts.to_a
      end

      # @!attribute [r] reader_url
      # @return [String]
      memoize def reader_url
        Projects::GetReaderURL.run! project: project
      end

      private

      def build_entries(builder)
        builder.simple! :compilation_version, "manifold/compilation_version", compilation_version
        builder.simple! :manifold_version, "manifold/version", manifold_version
        builder.json! :project_metadata, "metadata.json", project_metadata

        builder.extract_maker_avatar_entries_from! project, base: ""
      end
    end
  end
end
