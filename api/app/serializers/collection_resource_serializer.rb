# Provides a serialization of a collection model.
class CollectionResourceSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :id, :position, :resource_collection_id

  has_one :resource

end
