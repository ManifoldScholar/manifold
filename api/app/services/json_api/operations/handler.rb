module JSONAPI
  module Operations
    # rubocop:disable Style/MultilineBlockChain
    class Handler
      extend Dry::Initializer

      include Dry::Effects::Handler.Resolve
      include Dry::Effects::Handler.Reader(:operation_index)
      include Dry::Monads[:list, :result, :validated, :do]

      option :current_user

      def call(raw_params)
        params = yield parse_params(raw_params)

        results = params.operations.map.with_index do |operation, index|
          yield handle operation, index
        end

        wrapped = yield wrap results

        Success wrapped
      end

      private

      def handle(operation, index)
        provide(operation: operation, current_user: current_user) do
          with_operation_index(index) do
            operator_klass = yield operator_klass_for operation

            operator_params = yield operator_params_for operation

            operator = operator_klass.new operator_params

            operator.call.fmap do |data|
              { data: data }
            end.or do |err|
              unroll = UnrollErrors.new

              errors = unroll.call err

              Failure[:operation_failure, errors]
            end
          end
        end
      end

      def operator_klass_for(operation)
        if operation.for_collection?
          if operation.add_or_update?
            Success Collections::Operations::ValidateAndAssignMultiple
          elsif operation.remove?
            Success Collections::Operations::ValidateAndRemoveMultiple
          end
        else
          unsupported_operation
        end
      end

      def operator_params_for(operation)
        if operation.for_collection?
          Success operation.to_collection_params.merge(user: current_user)
        else
          # :nocov:
          unsupported_operation
          # :nocov:
        end
      end

      def parse_params(raw_params)
        Success JSONAPI::Operations::Params.parse raw_params
      rescue Dry::Struct::Error => e
        operation_failure(
          code: :invalid_params,
          title: "Invalid Operation Params",
          detail: e.message,
          status: :bad_request,
          pointer: "/"
        )
      end

      def unsupported_operation
        operation_failure(
          code: :unsupported_operation,
          title: "Don't know how to handle any non-collection operations",
          status: :unprocessable_entity,
          pointer: "/ref/relationship"
        )
      end

      def wrap(results)
        wrapped = {
          "atomic:results": results
        }

        Success wrapped
      end

      def operation_failure(**attributes)
        error = JSONAPI::Operations::Error.new(**attributes)

        errors = [error]

        Failure[:operation_failure, errors]
      end
    end
    # rubocop:enable Style/MultilineBlockChain
  end
end
