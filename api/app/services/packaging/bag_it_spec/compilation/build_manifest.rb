module Packaging
  module BagItSpec
    module Compilation
      # Generate the manifest for a {BagIt::Bag}.
      class BuildManifest
        include Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Packaging::BagItSpec::Context] :context
        # @return [void]
        def call(state)
          bag = state[:context].bag

          bag.manifest! algo: "sha256"
        end
      end
    end
  end
end
