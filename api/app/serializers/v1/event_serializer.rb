module V1
  class EventSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :event_type, Types::String.meta(read_only: true, example: "resource_collection_added")
    typed_attribute :event_url, Types::String.meta(
      read_only: true,
      example: "/project/023ebc40-174a-4056-b1e7-de1a1f52d666/ResourceCollection/aec3e2f6-f541-464c-b3cf-08ebba2a4453"
    )
    typed_attribute :subject_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :subject_type, Types::String.meta(example: "ResourceCollection", read_only: true)
    typed_attribute :subject_slug, Types::String.meta(read_only: true)
    typed_attribute :subject_title, Types::String.meta(read_only: true)
    typed_attribute :subject_subtitle, Types::String.optional.meta(read_only: true)
    typed_attribute :attribution_name, Types::String.optional.meta(read_only: true)
    typed_attribute :attribution_url, Types::String.optional.meta(read_only: true)
    typed_attribute :attribution_identifier, Types::String.optional.meta(read_only: true)
    typed_attribute :excerpt, Types::String.optional.meta(read_only: true)
    typed_attribute :project_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :project_slug, Types::String.meta(read_only: true)
    typed_attribute :event_title, Types::String.optional.meta(read_only: true)
    typed_attribute :event_subtitle, Types::String.optional.meta(read_only: true)
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :subject_title_formatted, Types::String.meta(read_only: true, example: "<p>string</p>")
  end
end
