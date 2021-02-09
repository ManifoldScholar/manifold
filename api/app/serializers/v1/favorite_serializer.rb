module V1
  class FavoriteSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_belongs_to :favoritable, polymorphic: true

    typed_attribute :favoritable_type, Types::String
    typed_attribute :favoritable_id, Types::Serializer::ID
    typed_attribute :subject_ids, Types::Array.of(Types::Serializer::ID).optional do |object|
      object.favorite_subject_ids
    end
  end
end
