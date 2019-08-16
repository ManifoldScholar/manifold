# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroupMembership < ApplicationRecord

  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include Filterable

  belongs_to :user, optional: false
  belongs_to :reading_group, optional: false, counter_cache: :memberships_count

  # rubocop:disable Rails/HasManyOrHasOneDependent
  has_one :reading_group_membership_count
  # rubocop:enable Rails/HasManyOrHasOneDependent

  delegate :annotations_count, to: :reading_group_membership_count
  delegate :highlights_count, to: :reading_group_membership_count

end
