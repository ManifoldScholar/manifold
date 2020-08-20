module Utility
  class MonadicStateOperation
    extend Dry::Initializer

    include Dry::Monads::Result::Mixin

    param :stateful, Types.Instance(HasStateMachine)

    delegate :current_state, to: :stateful

    # @param [Symbol] target_state
    # @return [Dry::Monads::Result::Success(HasStateMachine)]
    # @return [Dry::Monads::Result::Failure((Symbol, String))]
    def can_transition_to(target_state)
      return Success(stateful) if stateful.can_transition_to? target_state

      fail_with :invalid_transition, "Cannot transition from #{current_state} to #{target_state}"
    end

    # @param [Symbol] target_state
    # @return [Dry::Monads::Result::Success(HasStateMachine)]
    # @return [Dry::Monads::Result::Failure((Symbol, String))]
    def in_state(target_state)
      return fail_with(:invalid_state, "Expected state #{target_state}, currently #{current_state}") unless current_state == target_state

      Success(stateful)
    end

    # @param [Symbol] target_state
    # @return [Dry::Monads::Result::Success(HasStateMachine)]
    # @return [Dry::Monads::Result::Failure((Symbol, String))]
    def transition_to(target_state)
      if stateful.transition_to target_state
        Success stateful
      else
        fail_with_errors code: :invalid_transition, prefix: "Could not transition to #{target_state.inspect}"
      end
    ensure
      stateful.reload
    end

    private

    # @param [Symbol] code
    # @param [String] message
    # @return [Dry::Monads::Result::Failure((Symbol, String))]
    def fail_with(code, message)
      Failure [code, message]
    end

    def fail_with_errors(code: :invalid_state, prefix: "Failed", fallback_reason: "Unspecified failure")
      reason = stateful.errors.full_messages.to_sentence.presence || fallback_reason

      message = "#{prefix}: #{reason}"

      fail_with code, message
    end
  end
end
