module Collections
  module Operations
    # Designed to accept an assignment tuple from the server.
    #
    # Ensures the user is authorized to assign a collectable to a collector,
    # and then calls {Collections::Operations::Assign} to actually perform
    # the assignment.
    class ValidateAndAssign
      extend Dry::Initializer

      include Dry::Monads[:result, :do]
      include MonadicAuthorization

      option :user, model: "User"

      option :collector_type, Types::String

      option :collector_id, Types::String.optional, optional: true

      option :collectable_type, Types::String

      option :collectable_id, Types::String

      option :grouping_id, Types::String.optional, optional: true

      option :position, Types::Integer.optional, optional: true

      option :_collector, Types.Instance(Collections::Definition),
             as: :collector_definition, default: proc { Collections::Mapping[collector_type] }

      option :_collectable, Types.Instance(Collections::CollectableDefinition),
             as: :collectable_definition, default: proc { collector_definition[collectable_type] }

      # @return [Dry::Results::Monad<CollectionEntry>]
      def call
        collector = yield load_collector!

        collectable = yield load_collectable!

        yield authorize! collector, collectable

        grouping = yield maybe_load_grouping!(collector)

        assigned = yield assign! collector, collectable, grouping

        Success assigned
      end

      private

      def authorize!(collector, collectable)
        yield action_authorized(:update, collector.composed_collection, user)

        action_authorized(:read, collectable, user)
      end

      def load_collector!
        collector_definition.lookup.collector collector_id
      end

      def load_collectable!
        collector_definition.lookup.collectable collectable_type, collectable_id
      end

      def maybe_load_grouping!(collector)
        collector_definition.lookup.grouping_for collector, grouping_id
      end

      def assign!(collector, collectable, grouping)
        options = self.class.dry_initializer.attributes(self).merge(collector: collector, collectable: collectable, grouping: grouping)

        assign = Collections::Operations::Assign.new options

        assign.call
      end
    end
  end
end
