# Provides a serialization of a favorite model.
class FavoriteSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :id, :favoritable_type, :favoritable_id, :subject_ids
  belongs_to :favoritable

  def subject_ids
    out = object.favorite_subjects
                .select { |arr| arr.include?(object.favoritable_id) }
                .flatten
    out.delete(object.favoritable_id)
    out
  end
end
