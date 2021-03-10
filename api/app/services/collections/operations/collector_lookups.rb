module Collections
  module Operations
    # rubocop:disable Style/GuardClause, Metrics/MethodLength
    class CollectorLookups
      extend Dry::Initializer

      include Dry::Effects::Handler.Reader(:operation_data_path)
      include Dry::Monads[:result, :do]

      param :definition, Types.Instance(Collections::Definition)

      # @param [String] id
      # @return [ApplicationRecord]
      def collection(id)
        find_with! definition.collection, { definition.collector_foreign_key => id }, failure_message: "Could not find collection: #{id}"
      end

      # @param [String] id
      # @return [Collector]
      def collector(id, data_path: :collector_id)
        with_operation_data_path data_path do
          find_with! definition.collector, id, failure_message: "Could not find collector: #{definition.collector.name}"
        end
      end

      # @param [String] type
      # @param [String] id
      # @see Collections::CollectableDefinition#collectable
      # @return [Collectable]
      def collectable(type, id, type_data_path: :collectable_type, data_path: :collectable_id)
        cdefinition = yield collectable_definition type, data_path: type_data_path

        with_operation_data_path data_path do
          find_with! cdefinition.collectable, id, failure_message: "Unknown collectable #{type.to_s.inspect}: #{id}"
        end
      end

      # @param [String] type
      # @return [Collections::CollectableDefinition]
      def collectable_definition(type, data_path: :collectable_type)
        with_operation_data_path data_path do
          definition.collectables[type].yield_self do |defn|
            next Success defn if defn.present?

            operation_error :unknown_collectable_type, "Unknown collectable type: #{type.to_s.inspect}"
          end
        end
      end

      # @param [String] id
      # @return [CollectableGrouping, nil]
      def grouping(id, data_path: :grouping_id)
        return Success(nil) unless definition.has_grouping? && id.present?

        with_operation_data_path data_path do
          find_with! definition.grouping, id, failure_message: "Could not find #{definition.grouping} with #{id}"
        end
      end

      def grouping_for(collector, id, data_path: :grouping_id)
        found = yield grouping id, data_path: data_path

        return Success(nil) if found.blank?

        with_operation_data_path data_path do
          grouping_collector_id = found.public_send definition.collector_foreign_key

          if grouping_collector_id == collector.id
            Success found
          else
            return operation_error "#{inspect_model(found)} does not belong to #{inspect_model(collector)}"
          end
        end
      end

      private

      def find_with!(model_proxy, id, failure_message:, failure_code: :not_found)
        if Types::Model.valid?(id)
          if id.is_a?(model_proxy.klass)
            return Success(id)
          else
            return operation_error :invalid_model, "provided #{id.model_name} when #{model_proxy.name} was expected"
          end
        end

        klass = model_proxy.klass

        case id
        when Hash
          Success klass.find_by id
        when String, Integer
          Success klass.find id
        else
          operation_error failure_code, failure_message
        end
      rescue ActiveRecord::RecordNotFound
        operation_error failure_code, failure_message
      end

      def operation_error(code, title, **attributes)
        error = JSONAPI::Operations::Error.new code: code, title: title, **attributes

        Failure[error]
      end

      def inspect_model(model)
        "#{model.model_name}(#{model.id.inspect})"
      end
    end
    # rubocop:enable Style/GuardClause, Metrics/MethodLength
  end
end
