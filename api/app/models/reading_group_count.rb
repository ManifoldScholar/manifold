# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroupCount < ApplicationRecord

  include Concerns::View

  belongs_to :reading_group, optional: false

end
