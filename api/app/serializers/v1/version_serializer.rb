module V1
  class VersionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :item_type, Types::String.meta(read_only: true)
    typed_attribute :item_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :event, Types::String.meta(read_only: true)
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)

    # Strip out lateral, nil-nil changes and updated_at
    typed_attribute :object_changes, Types::Hash.meta(
      description: "Each key contains an array of values that describe how that project has changed over time. "\
      "This could be a history of changes for the project regarding title, description, slug, etc.\n"\
      'For example: "featured": [ false, true ]\n'\
      'This means the project was changed from "not featured" to "featured"',
      read_only: true
    ) do |object|
      object.object_changes&.except("updated_at")
    end

    typed_attribute :actor_name, Types::String.meta(
      description: "The name of the user that made the change",
      read_only: true
    ) do |object|
      object.actor&.name
    end

    typed_attribute :actor_id, Types::String.meta(
      description: "The ID of the user that made the change",
      read_only: true
    ) do |object|
      object.actor&.id
    end

    typed_attribute :deleted, Types::Bool.meta(read_only: true) do |object|
      object.item.nil?
    end

    typed_attribute :item_display_name, Types::String.meta(
      description: "The name displayed on the card for this event in history",
      read_only: true
    ) do |object|
      item_display_name(object)
    end

    typed_belongs_to :parent_item

    class << self
      def item_display_name(object)
        return object.item_title_formatted if object.item.respond_to? :title_formatted
        return object.item_title if object.item.respond_to? :title
        return "[deleted]" unless object.object

        object.object["title"] || object.title_fallback || object.object_changes["title"] || object.item_id
      end

    end

  end
end
