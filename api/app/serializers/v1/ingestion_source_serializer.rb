module V1
  class IngestionSourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :source_identifier, Types::String
    typed_attribute :kind, Types::String.enum("publication_resource", "navigation", "section", "cover_image")
  end
end
