# Provides a serialization of a category model.
class CategorySerializer < ActiveModel::Serializer
  cache key: "category", expires_in: 3.hours
  attributes :id, :title
end
