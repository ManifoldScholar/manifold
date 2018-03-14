# Provides a partial serialization of a project model.
class ProjectSerializer < ProjectPartialSerializer
  include SerializedMetadata

  meta(partial: false)

  attributes :event_count, :metadata, :collections_count, :resources_count,
             :uncollected_resources_count, :published_text_toc_id, :event_types,
             :metadata_properties, :citations, :hide_activity, :metadata_formatted

  link :self do
    "https://manifold-api.dev/api/v1/projects/#{object.id}"
  end

  has_many :texts, serializer: TextPartialSerializer
  has_one :published_text
  has_many :text_categories, serializer: CategorySerializer
  has_many :events
  has_many :collections
  has_many :uncollected_resources, serializer: ResourcePartialSerializer
  has_many :subjects
  has_many :twitter_queries
  has_many :permitted_users

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

  def event_types
    object.events.pluck(:event_type).uniq
  end

  def published_text_toc_id
    object.published_text.try(:toc_section).try(:id)
  end

end
