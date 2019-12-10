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

    # @see #maybe_fail
    # @param [ApplicationRecord] model
    # @param [Symbol] code the code to expose for the failure
    # @param [String] prefix the prefix to use before the flattened error messages of the model
    # @return [void]
    def try_to_save!(model, code: :invalid_model, prefix: "Could not save #{model.model_name}")
      fail! code, "#{prefix}: #{model.flattened_errors}" unless model.save
    end

    # @see #maybe_fail
    # @param [Symbol] code the code to expose for the failure
    # @param [String] reason the reason for the failure
    # @return [void]
    def fail!(code, reason)
      throw :failure, Failure([code, reason])
    end

    # @see #fail!
    # @see #try_to_save!
    def maybe_fail
      catch(:failure) do
        yield
      end
    end
  end
end
