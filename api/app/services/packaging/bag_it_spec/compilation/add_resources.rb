# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Compilation
      # Add a {Resource} (via {Packaging::BagItSpec::ResourceProxy proxy}) to the bagit archive
      class AddResources
        include Packaging::PipelineOperation

        # @param [BagIt::Bag] bag
        # @param [<Packaging::BagItSpec::ResourceProxy>] resources
        # @param [Hash] state
        # @return [void]
        def call
          state => { bag:, resources: }

          resources.each do |resource|
            resource.each_entry do |entry|
              entry.add_to! bag
            end
          end

          Success()
        end
      end
    end
  end
end
