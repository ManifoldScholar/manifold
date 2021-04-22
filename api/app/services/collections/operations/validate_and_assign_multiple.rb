module Collections
  module Operations
    # Designed to accept an assignment tuple from the server.
    #
    # Ensures the user is authorized to assign a collectable to a collector,
    # and then calls {Collections::Operations::Assign} to actually perform
    # the assignment.
    class ValidateAndAssignMultiple
      extend Dry::Initializer

      include Dry::Effects::Handler.Reader(:operation_data_index)
      include Dry::Monads[:list, :result, :validated, :do]
      include MonadicAuthorization

      option :user, model: "User"

      option :collector_type, Types::String

      option :collector_id, Types::String.optional, optional: true

      option :collectables, [] do
        include Dry::Monads[:list, :result, :validated, :do]

        option :collectable_type, Types::String

        option :collectable_id, Types::String

        option :grouping_id, Types::String.optional, optional: true

        option :position, Types::Coercible::Integer.optional, optional: true

        # @return [Dry::Monads::Result]
        def load!(collector, collector_definition)
          collectable = collector_definition.lookup.collectable(collectable_type, collectable_id).to_validated
          grouping = collector_definition.lookup.grouping_for(collector, grouping_id).to_validated
          position = validated_position

          List::Validated[collectable, grouping, position].traverse.to_result
        end

        private

        def validated_position
          Valid position
        end
      end

      option :_collector, Types.Instance(Collections::Definition),
             as: :collector_definition, default: proc { Collections::Mapping[collector_type] }, reader: :private

      # @return [Dry::Monads::Result]
      def call
        collector = yield load_collector!

        yield authorize_collector! collector

        collectable_list = yield load_all_collectables! collector

        collectables = collectable_list.to_a

        assign! collector, collectables
      end

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
        collectable, grouping, position = yield collectable_params.load! collector, collector_definition

        yield authorize_collectable! collectable

        params = %i[collectable grouping position].zip([collectable, grouping, position]).to_h

        Success params
      end

      def assign!(collector, collectables)
        options = { user: user, collector: collector, collectables: collectables.to_a }

        assign = Collections::Operations::AssignMultiple.new options

        assign.call
      end
    end
  end
end
