# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroupMembershipCount < ApplicationRecord

  include View

  belongs_to :reading_group_membership, optional: false

end
