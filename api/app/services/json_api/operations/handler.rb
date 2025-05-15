# frozen_string_literal: true

module JSONAPI
  module Operations
    class Handler
      extend ActiveModel::Callbacks

      include Dry::Effects::Handler.Reader(:current_user)
      include Dry::Effects::Handler.Reader(:operation_index)
      include Dry::Monads[:list, :result, :validated, :do]

      include Dry::Initializer[undefined: false].define -> do
        option :current_user, ::JSONAPI::Types::AnyUser, default: proc { AnonymousUser.new }
      end

      define_model_callbacks :handle_all, :handle_each

      around_handle_all :provide_current_user!

      def call(raw_params)
        prepare!

        params = yield parse_params(raw_params)

        results = yield handle_all!(params)

        wrapped = yield wrap results

        Success wrapped
      end

      private

      # @return [Array]
      attr_reader :operation_results

      # @return [void]
      def prepare!
        @operation_results = []
      end

      # @param [JSONAPI::Operations::Params] params
      # @return [Dry::Monads::Success(Array)]
      def handle_all!(params)
        run_callbacks :handle_all do
          params.operations.each_with_index do |operation, index|
            with_operation_index index do
              run_callbacks :handle_each do
                result = yield handle operation

                operation_results << result
              end
            end
          end
        end

        Success operation_results
      end

      # @param [JSONAPI::Operations::Operation] operation
      def handle(operation)
        operator_klass = yield operator_check! operation.operator_klass

        operator_params = yield operator_check! operation.operator_params

        operator = operator_klass.new(**operator_params)

        operator.call.fmap do |data|
          yield maybe_serialize data
        end.or do |err|
          unroll = UnrollErrors.new

          errors = unroll.call err

          Failure[:operation_failure, errors]
        end
      end

      # @param [Object] value
      # @return [Dry::Monads::Result]
      def operator_check!(value)
        return unsupported_operation if value.nil?

        Success value
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

      def maybe_serialize(data)
        serializer_klass = find_serializer_klass_for data

        return serialize_raw(data) unless serializer_klass.present?

        options = build_serializer_options

        serializer = serializer_klass.new(data, **options)

        Success serializer.serializable_hash
      end

      def find_serializer_klass_for(data)
        return nil unless data.is_a?(ApplicationRecord)

        possible_serializer_name = "V1::#{data.model_name}Serializer"

        possible_serializer_name.safe_constantize
      end

      def serialize_raw(data)
        serialized = yield serialize_raw_json data.as_json

        wrapped = { data: serialized }

        Success wrapped
      end

      def serialize_raw_json(json)
        case json
        when Hash
          json.deep_transform_keys { |key| key.to_s.camelize(:lower) }
        when Array
          json.map { |elt| yield serialize_raw_json elt.as_json }
        else
          json
        end.then do |value|
          Success value
        end
      end

      def build_serializer_options
        {
          params: build_serializer_params
        }
      end

      def build_serializer_params
        {
          authority_user: current_user,
          current_user: current_user
        }
      end

      # @!group Callbacks

      # @return [void]
      def provide_current_user!
        with_current_user current_user do
          yield
        end
      end

      # @!endgroup
    end
  end
end
