# A flag that flags a flaggable for review.
class Flag < ApplicationRecord

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor

  # Concerns
  include TrackedCreator

  # Scopes
  scope :by_creator, lambda { |creator|
    return all unless creator.present?
    where(creator: creator)
  }
  scope :by_flaggable, lambda { |flaggable|
    return all unless flaggable.present?
    where(flaggable: flaggable)
  }

  # Associations
  belongs_to :flaggable, polymorphic: true, counter_cache: :flags_count

  # # Validations
  # validates :flaggable, presence: true

end
