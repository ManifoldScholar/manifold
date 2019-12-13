module Packaging
  module BagItSpec
    # A context object that wraps around a {Project} for BagIt archiving.
    class Context
      extend Dry::Initializer
      extend Memoist

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
    end
  end
end
