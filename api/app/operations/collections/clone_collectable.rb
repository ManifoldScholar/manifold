# frozen_string_literal: true

module Collections
  # Clone a {CollectionEntry} within a source collection
  # to ensure that the target collection has the same entry.
  class CloneCollectable
    include Dry::Effects.Resolve(:clone_groupings)
    include Dry::Effects.Resolve(:clone_position)
    include Dry::Effects.Resolve(:grouping_map)
    include Dry::Effects.Resolve(:source_collectable_id)
    include Dry::Effects.Resolve(:source_grouping_id)
    include Dry::Effects.Resolve(:target)
    include Dry::Effects.Resolve(:target_collectable_id)
    include Dry::Effects.Resolve(:target_grouping_id)
    include Dry::Effects.Resolve(:target_entries)
    include Dry::Monads[:result]
    include MonadicPersistence

    # @param [CollectionEntry] source_entry
    # @return [Dry::Monads::Result]
    def call(source_entry)
      target_entry = target_from source_entry

      maybe_map_grouping_id! source_entry, target_entry

      target_entry.position = source_entry.position if clone_position

      monadic_save target_entry
    end

    private

    # @param [CollectionEntry] source_entry
    # @return [CollectionEntry]
    def target_from(source_entry)
      scope = target.public_send target_entries

      scope = scope.where(target_collectable_id => source_entry[source_collectable_id])

      scope.first_or_initialize
    end

    # @param [CollectionEntry] source_entry
    # @param [CollectionEntry] target_entry
    # @return [void]
    def maybe_map_grouping_id!(source_entry, target_entry)
      return unless clone_groupings

      source_id = source_entry[source_grouping_id]

      return if source_id.blank?

      mapped_id = grouping_map.fetch source_id

      target_entry[target_grouping_id] = mapped_id
    end
  end
end
