# Provides a serialization of a comment  model.
class CommentSerializer < ActiveModel::Serializer
  include Authorization
  meta(partial: false)

  attributes :id, :body, :parent_id, :created_at, :can_update_object, :can_delete_object,
             :can_read_deleted, :deleted, :children_count, :flags_count, :flagged,
             :sort_order

  belongs_to :creator

  def flagged
    user = scope.try(:authenticated_as)
    return 0 unless user
    object.flags.where(creator: user).count.positive?
  end

  def deleted_body
    return object.body if can_read_deleted
    nil
  end

  def body
    object.deleted == true ? deleted_body : object.body
  end

  def can_read_deleted
    scope.try(:authenticated_as).try(:can_read_deleted?, object)
  end

end
