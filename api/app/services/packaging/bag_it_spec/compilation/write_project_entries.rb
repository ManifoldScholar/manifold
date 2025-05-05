# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Compilation
      # Write the {Packaging::BagItSpec::Context#entries} to a file.
      #
      # @see Packaging::BagItSpec::Context#build_entries
      class WriteProjectEntries
        include Packaging::PipelineOperation

        # @param [BagIt::Bag] bag
        # @param [Packaging::BagItSpec::Context] context
        # @param [Hash] state
        # @return [void]
        def call
          state => { bag:, context: }

          context.each_entry do |entry|
            entry.add_to! bag
          end

          Success()
        end
      end
    end
  end
end
