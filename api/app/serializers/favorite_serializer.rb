# Provides a serialization of a favorite model.
class FavoriteSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :favoritable_type, :favoritable_id
  belongs_to :favoritable
end
