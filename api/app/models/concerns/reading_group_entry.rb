# An interface that defines a {CollectionEntry} for a {ReadingGroup}.
module ReadingGroupEntry
  extend ActiveSupport::Concern

  include CollectionEntry

  included do
    collectable_foreign_key = collectable_associations.collectable.foreign_key

    upsert_keys %I[reading_group_id #{collectable_foreign_key}]

    entries = collectable_associations.entries
    collectable = collectable_associations.collectable.singular

    belongs_to :reading_group, inverse_of: entries
    belongs_to collectable, inverse_of: entries
    belongs_to :reading_group_category, optional: true, inverse_of: entries

    acts_as_list scope: %i[reading_group_id reading_group_category_id]

    scope :in_order, -> { order(position: :asc) }
    scope :categorized, -> { where.not(reading_group_category_id: nil) }
    scope :uncategorized, -> { where(reading_group_category_id: nil) }

    validate :category_matches!

    after_save :update_collection_entry!
  end

  # @return [Hash]
  def to_collection_entry_params
    slice(:reading_group_id, :reading_group_category_id, :collectable_type, :collectable_id, :collectable_jsonapi_type).tap do |h|
      h[collectable_associations.entry.foreign_key] = id
    end
  end

  # @api private
  # @return [void]
  def update_collection_entry!
    ReadingGroupCompositeEntry.upsert! to_collection_entry_params
  end

  private

  # @return [void]
  def category_matches!
    return if reading_group_category_id.blank? || reading_group_category.reading_group == reading_group

    errors.add :reading_group_category, "does not belong to the same reading group"
  end
end
