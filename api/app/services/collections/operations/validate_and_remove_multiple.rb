module Collections
  module Operations
    class ValidateAndRemoveMultiple
      extend Dry::Initializer

      include Dry::Effects::Handler.Reader(:operation_data_index)
      include Dry::Monads[:list, :result, :validated, :do]
      include MonadicAuthorization

      option :user, model: "User"

      option :collector_type, Types::String

      option :collector_id, Types::String.optional, optional: true

      option :_collector, Types.Instance(Collections::Definition),
             as: :collector_definition, default: proc { Collections::Mapping[collector_type] }, reader: :private

      option :collectables, [] do
        include Dry::Monads[:list, :result, :validated, :do]

        option :collectable_type, Types::String

        option :collectable_id, Types::String

        # @return [Dry::Monads::Result]
        def load!(_collector, collector_definition)
          collector_definition.lookup.collectable(collectable_type, collectable_id)
        end
      end

      # @return [Dry::Monads::Result]
      def call
        collector = yield load_collector!

        yield authorize_collector! collector

        collectable_list = yield load_all_collectables! collector

        collectables = collectable_list.to_a

        remove! collector, collectables
      end

      private

      def authorize_collector!(collector)
        action_authorized(:update, collector.composed_collection, user)
      end

      def authorize_collectable!(collectable)
        action_authorized(:read, collectable, user)
      end

      def load_collector!
        collector_definition.lookup.collector collector_id
      end

      def load_all_collectables!(collector)
        loaded_collectables = collectables.map.with_index do |collectable, index|
          with_operation_data_index(index) do
            load_and_authorize_collectable!(collector, collectable).to_validated
          end
        end

        List::Validated[*loaded_collectables].traverse.to_result
      end

      def load_and_authorize_collectable!(collector, collectable_params)
        collectable = yield collectable_params.load! collector, collector_definition

        yield authorize_collectable! collectable

        params = { collectable: collectable }

        Success params
      end

      def remove!(collector, collectables)
        options = { user: user, collector: collector, collectables: collectables.to_a }

        remove = Collections::Operations::RemoveMultiple.new options

        remove.call
      end
    end
  end
end
