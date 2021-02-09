module Collections
  module Operations
    class Assign
      extend Dry::Initializer

      include Dry::Monads[:result, :do]
      include Collections::Operations::LoadsCollection
      include Collections::Operations::CollectableOption

      option :user, model: "User"

      option :collector, Types.Instance(ApplicationRecord)

      option :_collector, Types.Instance(Collections::Definition),
             as: :collector_definition, default: proc { Collections::Mapping[collector] }

      option :_collectable, Types.Instance(Collections::CollectableDefinition),
             as: :collectable_definition, default: proc { collector_definition[collectable] }

      # @return [Dry::Results::Monad<CollectionEntry>]
      def call
        yield upsert_entry!

        load_collection
      end

      private

      # @return [CollectionEntry]
      def upsert_entry!
        entry_collection = collectable_definition.entry_collection_scope_for collector

        attributes = build_attributes

        Success entry_collection.upsert!(attributes)
      end
    end
  end
end
