# Provides a full serialization of a project model.
class ProjectFullSerializer < ProjectSerializer
  include SerializedMetadata

  meta(partial: false)

  attributes :event_count, :metadata, :collections_count, :resources_count,
             :event_types, :metadata_properties, :citations, :hide_activity,
             :metadata_formatted

  has_many :texts
  has_many :published_texts
  has_many :text_categories, serializer: CategorySerializer
  has_many :events
  has_many :collections
  has_many :resources
  has_many :subjects
  has_many :twitter_queries
  has_many :permitted_users

  def filtered_events
    object.events.excluding_type(%w(comment_created text_annotated))
  end

  def event_count
    filtered_events.count
  end

  def resources
    object.resources.limit(10)
  end

  def events
    filtered_events.limit(6)
  end

  def event_types
    filtered_events.pluck(:event_type).uniq
  end

end
