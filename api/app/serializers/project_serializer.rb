# Provides a partial serialization of a project model.
class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :subtitle, :published, :published_datetime, :description,
             :cover_url, :created_at, :updated_at, :featured

  has_many :creators, serializer: MakerSerializer
  has_many :contributors, serializer: MakerSerializer
  has_many :texts, serializer: TextPartialSerializer
  has_many :text_categories, serializer: CategorySerializer
end
