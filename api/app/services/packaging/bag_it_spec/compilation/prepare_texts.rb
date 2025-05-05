# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Compilation
      class PrepareTexts
        include Packaging::PipelineOperation
        include Packaging::BagItSpec::Import[prepare_text: "compilation.prepare_text"]

        def call
          state[:texts] = state[:context].texts.map do |text|
            result = prepare_text.(text)

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
