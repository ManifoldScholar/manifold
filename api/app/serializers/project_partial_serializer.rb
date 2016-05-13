# Provides a partial serialization of a project model.
class ProjectPartialSerializer < ActiveModel::Serializer
  cache key: "project_partial", expires_in: 3.hours
  attributes :id, :title, :subtitle, :published_datetime, :description,
             :cover_url, :thumbnail_url, :created_at, :updated_at, :featured

  has_many :creators, serializer: MakerSerializer
  has_many :contributors, serializer: MakerSerializer
end
