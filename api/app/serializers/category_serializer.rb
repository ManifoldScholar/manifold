# Provides a serialization of a category model.
class CategorySerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :title, :position
end
