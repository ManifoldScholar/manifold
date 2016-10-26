# Provides a partial serialization of a project model.
class ProjectSerializer < ProjectPartialSerializer
  cache key: "project", expires_in: 3.hours
  attributes :event_count, :metadata

  link :self do
    "https://manifold-api.dev/api/v1/projects/#{object.id}"
  end

  has_many :texts, serializer: TextPartialSerializer
  has_one :published_text
  has_many :text_categories, serializer: CategorySerializer
  has_many :events

  def event_count
    object.events.count
  end

  def events
    object.events.limit(6)
  end
end
