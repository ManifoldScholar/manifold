class ReadingGroupKind < ApplicationRecord
  include Authority::Abilities
  include FriendlyId
  include SerializedAbilitiesFor

  friendly_id :slug_candidates, use: %i[slugged]

  has_many :reading_groups, inverse_of: :reading_group_kind, dependent: :nullify

  validates :name, uniqueness: true, presence: true

  def slug_candidates
    [[:name]]
  end
end
