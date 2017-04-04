# Provides a serialization of a collection model.
class CollectionSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :title, :created_at, :description, :project_id,
             :resource_kinds, :resource_tags, :thumbnail_styles

  has_many :resources, serializer: ResourcePartialSerializer
  belongs_to :project

end
