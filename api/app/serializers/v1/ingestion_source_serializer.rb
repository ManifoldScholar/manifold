module V1
  class IngestionSourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :source_identifier, Types::String
    typed_attribute :kind, Types::String.enum("publication_resource", "navigation", "section", "cover_image")
    typed_attribute :display_name, Types::String.optional
    typed_attribute :attachment_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :attachment_content_type, Types::String.optional.meta(read_only: true)
    typed_attribute :attachment_extension, Types::String.optional.meta(read_only: true)
    typed_attribute :attachment_file_size, Types::Integer.optional.meta(read_only: true)
    typed_attribute :attachment_alt_text, Types::String.optional

  end
end
