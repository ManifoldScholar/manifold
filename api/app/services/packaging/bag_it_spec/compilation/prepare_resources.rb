# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Compilation
      class PrepareResources
        include Packaging::PipelineOperation
        include Packaging::BagItSpec::Import[prepare_resource: "compilation.prepare_resource"]

        def call
          state[:resources] = state[:context].resources.map do |resource|
            result = prepare_resource.(resource)

            # :nocov:
            return result if result.failure?
            # :nocov:

            result.value!
          end

          Success()
        end
      end
    end
  end
end
