module Shared
  # Custom step adapters for use with various pipelines.
  #
  # @api private
  class StepAdapters < Dry::Transaction::StepAdapters
    # @api private
    module Haltable
      extend ActiveSupport::Concern

      include Dry::Monads::Result::Mixin

      def fail_with!(code, reason)
        halt! Failure([code, reason])
      end

      def halt!(throw_value = nil)
        throw :halt, throw_value
      end

      # @return [Dry::Monads::Result]
      def haltable
        result = catch :halt do
          yield
        end

        Types::MONADIC_RESULT[result]
      end
    end

    module AcceptsState
      extend ActiveSupport::Concern
      include Haltable

      # @param [Array] args
      # @return [(Hash, <Object>)]
      def extract_state_and_rest_from(args)
        state, *rest = args

        case state
        when Hash then [state, rest]
        else
          fail_with! :invalid_state, "Expected first arg to be hash: #{state.inspect}"
        end
      end
    end

    # @api private
    module HasTargetKey
      extend ActiveSupport::Concern
      include Haltable

      # @param [Hash] options
      # @option options [Symbol] :target
      # @return [Symbol]
      def target_key_from(options)
        options[:target].tap do |target_key|
          next target_key if target_key.is_a?(Symbol)

          fail_with! :invalid_batch_target, "Invalid batch map target key: #{target_key.inspect}"
        end
      end
    end

    # Map an array of arguments with a single operation, returning
    # the mapped results.
    #
    # It will call the associated operation for each provided input.
    #
    # If any operation fails, it will bubble up and fail the transaction.
    #
    # @api private
    class BatchMap
      include Dry::Monads::Result::Mixin
      include Haltable

      # @param [#call] operation
      # @param [Hash] _options
      # @param [<Object>] args
      # @return [Dry::Monads::Result]
      def call(operation, _options, args)
        haltable do
          initial, *rest = args

          Array(initial).each_with_object([]) do |input, results|
            operation_args = [input, *rest]

            result = Types::MONADIC_RESULT[operation.(*operation_args)]

            return result if result.failure?

            results << result.value!
          end
        end
      end
    end

    # Like {Packaging::Shared::StepAdapters::BatchMap}, except it operates on
    # a `Hash` state and expects a source key and a target key.
    #
    # It will call the associated operation for each provided input.
    #
    # If any operation fails, it will bubble up and fail the transaction.
    #
    # @api private
    class BatchMapState
      include Dry::Monads::Result::Mixin
      include AcceptsState
      include Haltable
      include HasTargetKey

      # @param [#call] operation
      # @param [Hash] options
      # @option options [Symbol] source
      # @option options [Symbol] target
      # @param [<Object>] first arg is expected to be a hash
      # @return [Dry::Monads::Result]
      def call(operation, options, args)
        haltable do
          state, rest = extract_state_and_rest_from args

          source = find_source_in state, options

          target_key = target_key_from options

          state[target_key] = Array(source).each_with_object([]) do |input, results|
            operation_args = [input, *rest]

            result = Types::MONADIC_RESULT[operation.(*operation_args)]

            halt! result if result.failure?

            results << result.value!
          end

          Success(state)
        end
      end

      private

      # @param [Hash] state
      # @param [Hash] options
      # @option options [Symbol, #call] :source
      # @return [Array, #to_a]
      def find_source_in(state, options)
        case options[:source]
        when Dux[:call] then options[:source].(state)
        when Symbol
          state.fetch(options[:source]) do
            fail_with! :invalid_batch_source, "Expected state to have source key: #{options[:source].inspect}"
          end
        when nil
          fail_with! :invalid_batch_source, "Missing :source key in step definition"
        else
          fail_with! :invalid_batch_source, "Don't know how to use source: #{options[:source].inspect}"
        end
      end
    end

    # A step adapter that operates much like `Object.tap`, and
    # the already-existing `tee` step adapter, except that it
    # specifically watches for failures.
    #
    # If the operation returns a failure, it bubbles up to fail
    # the transaction.
    #
    # @api private
    class Pipe
      include Dry::Monads::Result::Mixin

      # @param [#call] operation
      # @param [Hash] _options
      # @param [<Object>] args
      # @return [Dry::Monads::Result]
      def call(operation, _options, args)
        result = Types::MONADIC_RESULT[operation.(*args)]

        return result if result.failure?

        Success(args[0])
      end
    end

    # A step adapter that takes a state and allows an operation
    # to pipe its result into a specified key on the state.
    #
    # If the operation returns a failure, it bubbles up to fail
    # the transaction.
    #
    # @api private
    class PipeInto
      include Dry::Monads::Result::Mixin
      include AcceptsState
      include Haltable
      include HasTargetKey

      # @param [#call] operation
      # @param [Hash] options
      # @option options [Symbol] target
      # @param [<Object>] first arg is expected to be a hash
      # @return [Dry::Monads::Result]
      def call(operation, options, args)
        haltable do
          state = extract_state_and_rest_from(args).first

          target_key = target_key_from options

          result = Types::MONADIC_RESULT[operation.(*args)]

          halt! result if result.failure?

          state[target_key] = result.value!

          Success(state)
        end
      end
    end

    # A step adapter that operates much like `step` / `map`, but
    # will automatically set the result to be wrapped in a `Success`
    # if it isn't already (and is not a `Failure`).
    #
    # @api private
    class AutoStep
      include Dry::Monads::Result::Mixin

      # @param [#call] operation
      # @param [Hash] _options
      # @param [<Object>] args
      # @return [Dry::Monads::Result]
      def call(operation, _options, args)
        Types::MONADIC_RESULT[operation.(*args)]
      end
    end

    register :auto_step, AutoStep.new

    register :batch_map, BatchMap.new

    register :batch_map_state, BatchMapState.new

    register :pipe, Pipe.new

    register :pipe_into, PipeInto.new
  end
end
