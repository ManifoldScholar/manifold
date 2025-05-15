# frozen_string_literal: true

module Collections
  module Operations
    class AssignMultiple
      extend ActiveModel::Callbacks
      extend Dry::Initializer

      include Collections::Operations::AcceptsMultipleCollectables
      include Collections::Operations::LoadsCollection

      define_model_callbacks :upsert_entries

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

          handle_upsert_for! entry_collection
        end
      end

      around_upsert_entries :disable_acts_as_list!, if: :should_disable_acts_as_list?

      # @return [Dry::Monads::Result(ComposedCollection)]
      def call
        prepare!

        yield upsert_entries!

        load_collection
      end

      private

      # @return [void]
      def disable_acts_as_list!
        ManifoldApi::Container["collections.positions_updater"].wrap_mass_assignment do
          yield
        end
      end

      # @return [void]
      def prepare!
        @should_disable_acts_as_list = collectables.many?(&:has_position?)
      end

      # If we are updating many collectables at a time with a position property provided,
      # we should disable acts_as_list's incrementing logic since the UI is sending data.
      #
      # This value is presently derived from the expression: `collectables.many?(&:has_position?)`.
      #
      # We use `many?` since setting just one position should probably still adjust the rest of the list.
      #
      # @return [Boolean]
      attr_reader :should_disable_acts_as_list

      alias should_disable_acts_as_list? should_disable_acts_as_list

      # @return [Dry::Monads::Result]
      def upsert_entries!
        run_callbacks :upsert_entries do
          map_collectables do |collectable|
            collectable.upsert_entry!
          end
        end
      end
    end
  end
end
