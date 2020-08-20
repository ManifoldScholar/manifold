# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroupCount < ApplicationRecord

  include View

  belongs_to :reading_group, optional: false

end
