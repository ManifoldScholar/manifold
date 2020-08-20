module Shared
  module PipelineOperation
    extend ActiveSupport::Concern

    include Dry::Transaction::Operation
    include Dry::Matcher.for(:monadic_can_transition_to!, with: Dry::Matcher::ResultMatcher)
    include Dry::Matcher.for(:monadic_in_state!, with: Dry::Matcher::ResultMatcher)
    include Dry::Matcher.for(:monadic_transition_to!, with: Dry::Matcher::ResultMatcher)

    def build_state(**pairs)
      built_state = { **pairs }.tap do |state|
        yield state if block_given?
      end

      Success(built_state)
    end

    def compose_monadic_interaction(interaction, inputs = {}, &block)
      interaction.run_as_monad(inputs, &block)
    end

    # @param [HasStateMachine] stateful
    # @param [Symbol] target_state
    # @return [Dry::Monads::Result]
    def monadic_can_transition_to!(stateful, target_state)
      Utility::MonadicStateOperation.new(stateful).can_transition_to target_state
    end

    # @param [HasStateMachine] stateful
    # @param [Symbol] target_state
    # @return [Dry::Monads::Result]
    def monadic_in_state!(stateful, target_state)
      Utility::MonadicStateOperation.new(stateful).in_state target_state
    end

    # @param [HasStateMachine] stateful
    # @param [Symbol] target_state
    # @return [Dry::Monads::Result]
    def monadic_transition_to!(stateful, target_state)
      Utility::MonadicStateOperation.new(stateful).transition_to target_state
    end

    # @return [Dry::Types::Result::Success(ApplicationRecord)]
    def monadic_save(model, code: :invalid_model, prefix: "Could not save #{model.model_name}")
      model.save ? Success(model) : Failure([code, "#{prefix}: #{model.flattened_errors}"])
    end

    # @see #maybe_fail
    # @param [ApplicationRecord] model
    # @param [Symbol] code the code to expose for the failure
    # @param [String] prefix the prefix to use before the flattened error messages of the model
    # @return [void]
    def try_to_save!(model, code: :invalid_model, prefix: "Could not save #{model.model_name}")
      result = monadic_save(model, code: code, prefix: prefix)

      throw :failure, result if result.failure?
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
