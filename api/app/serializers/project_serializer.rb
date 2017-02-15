# Provides a partial serialization of a project model.
class ProjectSerializer < ProjectPartialSerializer
  meta(partial: false)

  attributes :event_count, :metadata, :collections_count, :resources_count,
             :uncollected_resources_count, :resource_kinds, :resource_tags

  link :self do
    "https://manifold-api.dev/api/v1/projects/#{object.id}"
  end

  has_many :texts, serializer: TextPartialSerializer
  has_one :published_text
  has_many :text_categories, serializer: CategorySerializer
  has_many :events
  has_many :collections
  has_many :uncollected_resources

  def event_count
    object.events.count
  end

  def uncollected_resources_count
    object.uncollected_resources.count
  end

  def uncollected_resources
    object.uncollected_resources.limit(12)
  end

  def events
    object.events.limit(6)
  end
end
