# Provides a serialization of a collection model.
class CollectionResourceSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :position, :collection_id

  has_one :resource

end
