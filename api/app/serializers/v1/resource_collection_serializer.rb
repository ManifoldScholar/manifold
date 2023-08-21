module V1
  class ResourceCollectionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :title, Types::String
    typed_attribute :title_formatted, Types::String.meta(read_only: true)
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :description, Types::String.optional
    typed_attribute :description_formatted, Types::String.meta(read_only: true)
    typed_attribute :project_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :resource_kinds, Types::Array.of(Types::String).meta(read_only: true)
    typed_attribute :collection_resources_count, Types::Integer.meta(read_only: true)
    typed_attribute :slug, Types::String.meta(read_only: true)
    typed_attribute :pending_slug, Types::String
    typed_attribute :thumbnail_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :thumbnail_alt_text, Types::String.optional
    typed_attribute :project_slug, Types::String.meta(read_only: true)
    typed_attribute :resource_tags, Types::Array.of(Types::String) do |object, _params|
      object.resource_tags.sort
    end

    typed_has_many :resources
    typed_belongs_to :project

    serialize_collectable_attributes!
  end
end
