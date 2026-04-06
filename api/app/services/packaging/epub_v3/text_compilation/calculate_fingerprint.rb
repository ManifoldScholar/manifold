# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextCompilation
      # @see Texts::CalculateFingerprint
      class CalculateFingerprint
        include Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Text] :text
        # @return [Dry::Monads::Result(String)]
        def call
          result = ::Texts::CalculateFingerprint.run_as_monad text: state[:text]

          # :nocov:
          return result if result.failure?
          # :nocov:

          state[:fingerprint] = result.value!

          Success()
        end
      end
    end
  end
end
