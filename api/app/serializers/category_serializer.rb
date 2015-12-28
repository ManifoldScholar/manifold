# Provides a partial serialization of a maker model.
class CategorySerializer < ActiveModel::Serializer
  attributes :id, :title
end
