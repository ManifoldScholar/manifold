module V1
  class IngestionSourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :source_identifier, Types::String
    typed_attribute :kind, Types::String.enum("publication_resource", "navigation", "section", "cover_image")
    typed_attribute :display_name, Types::String.optional
    typed_attribute :attachment_data, Types::Serializer::Attachment.meta(read_only: true)
  end
end
