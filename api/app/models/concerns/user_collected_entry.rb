module UserCollectedEntry
  extend ActiveSupport::Concern

  include CollectionEntry

  included do
    collectable_foreign_key = collectable_associations.collectable.foreign_key

    upsert_keys %I[user_id #{collectable_foreign_key}]

    entries = collectable_associations.entries
    collectable = collectable_associations.collectable.singular

    belongs_to :user, inverse_of: entries
    belongs_to collectable, inverse_of: entries

    has_one :project, through: collectable unless collectable_project?

    has_one :user_collected_composite_entry, dependent: :destroy

    has_one :favorite, through: :user_collected_composite_entry

    scope :in_order, -> { order(created_at: :desc) }

    after_save :update_collection_entry!
  end

  def collectable
    public_send collectable_associations.collectable.singular
  end

  # @return [Favorite]
  def favorite
    Favorite.where(user: user, favoritable: collectable).first!
  end

  # @return [Hash]
  def to_collection_entry_params
    slice(:user_id, :collectable_type, :collectable_id, :collectable_jsonapi_type, :project_id, :created_at, :updated_at).tap do |h|
      h[collectable_associations.entry.foreign_key] = id
    end
  end

  # @api private
  # @return [void]
  def update_collection_entry!
    UserCollectedCompositeEntry.upsert! to_collection_entry_params
  end
end
