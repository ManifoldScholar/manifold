# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Compilation
      # Generate the manifest for a {BagIt::Bag}.
      class BuildManifest
        include Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Packaging::BagItSpec::Context] :context
        # @return [void]
        def call
          bag = state[:context].bag

          bag.manifest! algo: "sha256"

          Success()
        end
      end
    end
  end
end
