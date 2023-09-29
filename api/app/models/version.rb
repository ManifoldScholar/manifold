# frozen_string_literal: true

class Version < PaperTrail::Version

  include Authority::Abilities
  include SerializedAbilitiesFor
  include Filterable

  delegate :title, :title_formatted, to: :item, prefix: true

  belongs_to :parent_item,
             polymorphic: true,
             optional: true

  scope :with_actor, -> { where.not(whodunnit: nil) }
  scope :for_item, lambda { |item|
    next all unless item.present?

    where(item: item)
      .or(where(item_id: item.tracked_dependent_versions.select(:item_id)))
      .order(created_at: :desc)
  }
end
