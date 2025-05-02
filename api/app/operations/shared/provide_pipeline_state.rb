# frozen_string_literal: true

module Shared
  class ProvidePipelineState
    include Dry::Monads[:result]
    include Dry::Effects::Handler.Reader(:pipeline_state)
    include Dry::Effects::Handler.State(:pipeline_result)

    def call(input, &block)
      initial_pipeline_state = {}

      return_value, result = with_pipeline_result(nil) do
        with_pipeline_state(initial_pipeline_state) do
          block.(Success(input))
        end
      end

      return result.fmap { return_value }
    end
  end
end
