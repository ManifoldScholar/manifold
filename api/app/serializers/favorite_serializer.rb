# Provides a serialization of a favorite model.
class FavoriteSerializer < ActiveModel::Serializer
  attributes :id
  belongs_to :favoritable
end
