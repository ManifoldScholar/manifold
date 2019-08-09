# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroup < ApplicationRecord

  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include TrackedCreator

  has_many :reading_group_memberships, dependent: :destroy
  has_many :users, through: :reading_group_memberships

  validates :name, presence: true

end
