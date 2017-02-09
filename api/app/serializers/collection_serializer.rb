# Provides a serialization of a collection model.
class CollectionSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :title, :thumbnail_url, :created_at, :description,
             :resource_kinds

  has_many :resources
  belongs_to :project

end
