# Provides a serialization of a comment  model.
class CommentSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :body, :parent_id, :created_at

  belongs_to :creator
end
