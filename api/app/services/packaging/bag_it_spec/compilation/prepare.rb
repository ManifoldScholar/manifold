module Packaging
  module BagItSpec
    module Compilation
      # Set up the {Project}'s initial {Packaging::BagItSpec::Context BagIt context}
      # along with the state for the pipeline.
      class Prepare
        include Packaging::PipelineOperation

        # @param [Project] project
        # @param [Pathname, String] tmp_root
        # @return [Hash]
        def call(project, tmp_root: Packaging::BagItSpec::Compilation::TMP_ROOT)
          FileUtils.mkpath tmp_root

          context = Packaging::BagItSpec::Context.new project, tmp_root: tmp_root.to_s

          build_path = context.build_path
          bag = context.bag

          build_state bag: bag, build_path: build_path, context: context
        end
      end
    end
  end
end
