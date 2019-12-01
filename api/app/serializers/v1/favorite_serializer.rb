module V1
  class FavoriteSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    attributes :favoritable_type,
               :favoritable_id

    attributes :subject_ids do |object, _params|
      object.favorite_subjects
        .select { |arr| arr.include?(object.favoritable_id) }
        .flatten
        .delete(object.favoritable_id)
    end

    belongs_to :favoritable, polymorphic: true

  end
end
