module Collections
  module Operations
    class AssignMultiple
      extend Dry::Initializer

      include Collections::Operations::AcceptsMultipleCollectables
      include Collections::Operations::LoadsCollection

      option :user, model: "User"

      option :collector, Types.Instance(ApplicationRecord)

      option :_collector, Types.Instance(Collections::Definition),
             as: :collector_definition, default: proc { Collections::Mapping[collector] }, reader: :private

      option :collectables, [] do
        include Collections::Operations::CollectableOption
        include Dry::Effects.Resolve(:collector, :collector_definition)
        include Dry::Monads[:result, :do]

        def upsert_entry!
          entry_collection = yield entry_collection_scope

          attributes = build_attributes

          Success entry_collection.upsert!(attributes)
        rescue ActiveRecord::RecordInvalid => e
          operation_error title: "Failed Upsert", detail: e.message, code: :invalid_entry
        end
      end

      # @return [Dry::Monads::Result]
      def call
        yield upsert_entries!

        load_collection
      end

      private

      # @return [Dry::Monads::Result]
      def upsert_entries!
        map_collectables do |collectable|
          collectable.upsert_entry!
        end
      end
    end
  end
end
