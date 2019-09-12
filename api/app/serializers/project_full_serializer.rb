# Provides a full serialization of a project model.
class ProjectFullSerializer < ProjectSerializer
  include SerializedMetadata

  meta(partial: false)

  attributes :hashtag, :description, :featured, :purchase_url, :purchase_price_currency,
             :purchase_price, :purchase_call_to_action, :twitter_id, :instagram_id, :facebook_id,
             :cover_styles, :description_formatted, :resource_kinds, :resource_tags, :dark_mode,
             :image_credits, :image_credits_formatted, :tag_list

  attributes :event_count, :metadata, :resource_collections_count, :resources_count,
             :event_types, :metadata_properties, :citations, :hide_activity,
             :metadata_formatted, :standalone_mode

  has_many :texts
  has_many :published_texts
  has_many :text_categories, serializer: CategorySerializer
  has_many :events
  has_many :resource_collections
  has_many :resources
  has_many :subjects
  has_many :twitter_queries
  has_many :permitted_users
  has_many :content_blocks
  has_many :action_callouts
  has_many :contributors, serializer: MakerSerializer

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

  def resource_tags
    object.resource_tags.sort
  end

  def content_blocks
    if current_user&.can_update? object
      object.content_blocks
    else
      object.content_blocks.visible
    end
  end

end
