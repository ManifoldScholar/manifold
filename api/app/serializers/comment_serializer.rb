# Provides a serialization of a comment  model.
class CommentSerializer < ApplicationSerializer

  meta(partial: false)

  attributes :id, :body, :parent_id, :created_at, :flags_count, :flagged,
             :abilities, :deleted, :children_count, :sort_order, :author_created

  belongs_to :creator

  def flagged
    return false unless authenticated?

    object.flags.where(creator: current_user).count.positive?
  end

  def deleted_body
    return object.body if current_user&.can_read_deleted? object

    nil
  end

  def body
    object.deleted == true ? deleted_body : object.body
  end
end
