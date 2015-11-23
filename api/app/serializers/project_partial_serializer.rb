# Provides a partial serialization of a project model.
class ProjectPartialSerializer < ActiveModel::Serializer
  attributes :id, :title, :subtitle, :published, :published_datetime, :description,
             :cover_url, :created_at, :updated_at, :featured

  has_many :creators, serializer: MakerSerializer
  has_many :contributors, serializer: MakerSerializer

end
