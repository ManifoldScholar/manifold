# Provides a partial serialization of a maker model.
class MakerSerializer < ActiveModel::Serializer
  attributes :id, :name
end
