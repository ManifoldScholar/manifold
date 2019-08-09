# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroup < ApplicationRecord

  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include TrackedCreator

  has_many :reading_group_memberships, dependent: :destroy
  has_many :users, through: :reading_group_memberships
  has_many :annotations, dependent: :nullify
  has_one :reading_group_count

  delegate :annotations_count, to: :reading_group_count
  delegate :highlights_count, to: :reading_group_count

  validates :name, presence: true

  before_save :ensure_creator_membership

  private

  def ensure_creator_membership
    users << creator unless users.include? creator
  end

end
