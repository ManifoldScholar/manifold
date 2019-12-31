module V1
  class FavoriteSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :favoritable_type, Types::String
    typed_attribute :favoritable_id, Types::Serializer::ID
    typed_attribute :subject_ids, Types::Array.of(Types::Serializer::ID).optional do |object, _params|
      object.favorite_subjects
        .select { |arr| arr.include?(object.favoritable_id) }
        .flatten
        .delete(object.favoritable_id)
    end

    typed_belongs_to :favoritable, polymorphic: true

  end
end
