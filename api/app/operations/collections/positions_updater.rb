# frozen_string_literal: true

module Collections
  # An operation that exposes a single method, `#wrap`, which can be used
  # to wrap mass-assignments of positions in an atomic operation.
  #
  # @api private
  # @see Collections::Operations::AssignMultiple
  class PositionsUpdater
    extend Dry::Core::Cache

    include Dry::Effects::Handler.Reader(:collection_entry_mass_update_klasses)

    # @return [void]
    def wrap_mass_assignment
      # :nocov:
      return yield if reorderable_entry_classes.blank?
      # :nocov:

      first_klass, *extra_klasses = reorderable_entry_classes

      with_collection_entry_mass_update_klasses reorderable_entry_classes do
        first_klass.acts_as_list_no_update(extra_klasses) do
          yield
        end
      end
    end

    private

    def reorderable_entry_classes
      fetch_or_store(__method__) do
        ::Collections::Mapping.select(&:reorderable?).flat_map do |defn|
          defn.collectable_entries.map(&:klass)
        end
      end
    end
  end
end
