module Packaging
  module BagItSpec
    module Compilation
      # Write the {Packaging::BagItSpec::Context#project_metadata} to a file.
      #
      # @see Packaging::Preservation::ExportProjectMetadata
      class WriteMetadata
        include Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Packaging::BagItSpec::Context] :context
        # @return [void]
        def call(state)
          bag = state[:context].bag

          bag.add_file "metadata.json" do |f|
            f.write JSON.pretty_generate(state[:context].project_metadata)
          end
        end
      end
    end
  end
end
