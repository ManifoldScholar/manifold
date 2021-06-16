module Collections
  module Operations
    class RemoveMultiple
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
        include Dry::Monads[:do, :result]

        def remove_entry!
          entry = yield find_entry

          entry.destroy! if entry.present?
        rescue ActiveRecord::RecordNotDestroyed
          operation_error title: "Failed To Remove", detail: rgp.flattened_errors, code: :cannot_remove
        else
          Success nil
        end

        # @api private
        def find_entry
          entry_collection = yield entry_collection_scope

          entry = entry_collection.by_collectable(collectable).first

          Success entry
        end
      end

      # @return [Dry::Monads::Result(ComposedCollection)]
      def call
        yield remove_entries!

        load_collection
      end

      private

      # @return [Dry::Monads::Result]
      def remove_entries!
        map_collectables do |collectable|
          collectable.remove_entry!
        end
      end
    end
  end
end
