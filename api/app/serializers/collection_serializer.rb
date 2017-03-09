# Provides a serialization of a collection model.
class CollectionSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :title, :created_at, :description,
             :resource_kinds, :resource_tags, :thumbnail_styles

  has_many :resources
  belongs_to :project

end
