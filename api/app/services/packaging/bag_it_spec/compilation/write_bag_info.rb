module Packaging
  module BagItSpec
    module Compilation
      # Write bag info headers that were generated in {Packaging::BagItSpec::Compilation::GenerateBagInfo}.
      class WriteBagInfo
        include Packaging::PipelineOperation

        # @param [BagIt::Bag] bag
        # @param [{ String => String }] bag_info
        # @param [Hash] state
        # @return [void]
        def call(bag:, bag_info:, **_state)
          bag.write_bag_info bag_info
        end
      end
    end
  end
end
