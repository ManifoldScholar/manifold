class VersionSerializer < ApplicationSerializer
  attributes :item_type, :item_id, :object_changes, :item_display_name,
             :event, :actor_name, :actor_id, :created_at

  belongs_to :parent_item

  # Strip out lateral, nil-nil changes and updated_at
  def object_changes
    object.object_changes.reject do |_key, value|
      value[0].blank? && value[1].blank?
    end.except("updated_at")
  end

  def actor_name
    object.actor.name
  end

  def actor_id
    object.actor.id
  end

  def item_display_name
    return object.item_title_formatted if object.item.respond_to? :title_formatted
    return object.item_title if object.item.respond_to? :title
    object.item.id
  end
end
