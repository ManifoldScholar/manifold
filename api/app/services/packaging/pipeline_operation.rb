module Packaging
  module PipelineOperation
    extend ActiveSupport::Concern

    include Dry::Transaction::Operation

    def build_state(**pairs)
      built_state = { **pairs }.tap do |state|
        yield state if block_given?
      end

      Success(built_state)
    end

    def compose_monadic_interaction(interaction, inputs = {}, &block)
      interaction.run_as_monad(inputs, &block)
    end
  end
end
