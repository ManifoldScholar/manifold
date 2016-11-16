# Provides a serialization of a collection model.
class CollectionResourceSerializer < ActiveModel::Serializer
  cache key: "collection_resource", expires_in: 3.hours
  attributes :id, :position, :collection_id

  has_one :resource

end
