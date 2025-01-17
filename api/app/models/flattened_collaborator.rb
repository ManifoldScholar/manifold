class FlattenedCollaborator < ApplicationRecord
  include WithParsedName
  belongs_to :maker
  belongs_to :collaborator
  belongs_to :collaboratable, polymorphic: true

  with_parsed_name :prefix, :first_name, :middle_name, :last_name, :suffix

  self.primary_key = :id

  def readonly?
    true
  end
end
