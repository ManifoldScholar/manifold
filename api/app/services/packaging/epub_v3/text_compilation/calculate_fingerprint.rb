module Packaging
  module EpubV3
    module TextCompilation
      # @see Texts::CalculateFingerprint
      class CalculateFingerprint
        include Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Text] :text
        # @return [Dry::Monads::Result(String)]
        def call(state)
          ::Texts::CalculateFingerprint.run_as_monad text: state[:text]
        end
      end
    end
  end
end
