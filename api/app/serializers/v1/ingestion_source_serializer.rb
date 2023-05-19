module V1
  class IngestionSourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :source_identifier, Types::String
    typed_attribute :kind, Types::String.enum("publication_resource", "navigation", "section", "cover_image")
    typed_attribute :display_name, Types::String.optional
    typed_attribute :display_name_formatted, Types::String.optional.meta(read_only: true)
    typed_attribute :file_name, Types::String do | object |
      object.attachment_data["metadata"]["filename"]
    end
    typed_attribute :mime_type, Types::String do | object |
      object.attachment_data["metadata"]["mime_type"]
    end
  end
end
