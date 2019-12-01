module V1
  class VersionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    attributes :item_type,
               :item_id,
               :event,
               :created_at

    # Strip out lateral, nil-nil changes and updated_at
    attributes :object_changes do |object|
      object.object_changes.except("updated_at")
    end

    attributes :actor_name do |object|
      object.actor.name
    end

    attributes :actor_id do |object|
      object.actor.id
    end

    attributes :deleted do |object|
      object.item.nil?
    end

    attributes :item_display_name do |object|
      item_display_name(object)
    end

    belongs_to :parent_item

    class << self
      # rubocop:disable Metrics/AbcSize
      def item_display_name(object)
        return object.item_title_formatted if object.item.respond_to? :title_formatted
        return object.item_title if object.item.respond_to? :title

        object.object["title"] || object.item_id
      end
      # rubocop:enable Metrics/AbcSize
    end

  end
end
