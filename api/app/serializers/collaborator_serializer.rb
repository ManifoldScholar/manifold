# Provides a serialization of a collaborator model.
class CollaboratorSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :role

  belongs_to :maker
  belongs_to :collaboratable

end
