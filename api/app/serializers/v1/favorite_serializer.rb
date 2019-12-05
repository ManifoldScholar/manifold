module V1
  class FavoriteSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :favoritable_type, NilClass
    typed_attribute :favoritable_id, NilClass
    typed_attribute :subject_ids, NilClass do |object, _params|
      object.favorite_subjects
        .select { |arr| arr.include?(object.favoritable_id) }
        .flatten
        .delete(object.favoritable_id)
    end

    typed_belongs_to :favoritable, polymorphic: true

  end
end
