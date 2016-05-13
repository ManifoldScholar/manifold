# Provides a partial serialization of a maker model.
class MakerSerializer < ActiveModel::Serializer
  cache key: "maker", expires_in: 3.hours
  attributes :id, :name
end
