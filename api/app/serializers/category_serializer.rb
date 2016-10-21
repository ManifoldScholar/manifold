# Provides a partial serialization of a maker model.
class CategorySerializer < ActiveModel::Serializer
  cache key: "category", expires_in: 3.hours
  attributes :id, :title
end
