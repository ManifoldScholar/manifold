class FlattenedCollaborator < ApplicationRecord
  belongs_to :maker
  belongs_to :collaboratable, polymorphic: true

  self.primary_key = :id

  def readonly?
    true
  end
end
