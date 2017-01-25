# Provides a serialization of a collection model.
class CollectionSerializer < ActiveModel::Serializer
  cache key: "collection", expires_in: 3.hours
  attributes :id, :title, :thumbnail_url, :created_at, :description,
             :resource_kinds

  has_many :resources
  belongs_to :project

end
