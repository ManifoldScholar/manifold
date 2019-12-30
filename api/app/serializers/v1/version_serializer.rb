module V1
  class VersionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :item_type, NilClass
    typed_attribute :item_id, NilClass
    typed_attribute :event, NilClass
    typed_attribute :created_at, NilClass

    # Strip out lateral, nil-nil changes and updated_at
    typed_attribute :object_changes, Hash do |object|
      object.object_changes&.except("updated_at")
    end

    typed_attribute :actor_name, NilClass do |object|
      object.actor&.name
    end

    typed_attribute :actor_id, NilClass do |object|
      object.actor&.id
    end

    typed_attribute :deleted, NilClass do |object|
      object.item.nil?
    end

    typed_attribute :item_display_name, NilClass do |object|
      item_display_name(object)
    end

    typed_belongs_to :parent_item

    class << self
      # rubocop:disable Metrics/AbcSize
      def item_display_name(object)
        return object.item_title_formatted if object.item.respond_to? :title_formatted
        return object.item_title if object.item.respond_to? :title

        object.object["title"] || object.title_fallback || object.object_changes["title"] || object.item_id
      end
      # rubocop:enable Metrics/AbcSize
    end

  end
end
