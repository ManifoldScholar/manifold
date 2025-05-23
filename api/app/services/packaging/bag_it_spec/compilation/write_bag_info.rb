# frozen_string_literal: true

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
        def call
          state => { bag:, bag_info: }

          bag.write_bag_info bag_info

          Success()
        end
      end
    end
  end
end
