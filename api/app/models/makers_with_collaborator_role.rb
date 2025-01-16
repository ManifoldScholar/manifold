class MakersWithCollaboratorRole < ApplicationRecord
  include WithParsedName
  belongs_to :maker
  belongs_to :collaborator
  belongs_to :commentable, polymorphic: true

  with_parsed_name :prefix, :first_name, :middle_name, :last_name, :suffix

  self.primary_key = :collaborator_id

  def readonly?
    true
  end
end
