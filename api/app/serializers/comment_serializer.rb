# Provides a serialization of a comment  model.
class CommentSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :body
end
