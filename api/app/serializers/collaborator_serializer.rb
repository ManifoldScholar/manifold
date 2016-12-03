# Provides a serialization of a collaborator model.
class CollaboratorSerializer < ActiveModel::Serializer
  cache key: "collaborator", expires_in: 3.hours
  attributes :id, :role

  belongs_to :maker
  belongs_to :collaboratable

end
