# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroupMembership < ApplicationRecord

  belongs_to :user, optional: false
  belongs_to :reading_group, optional: false

end
