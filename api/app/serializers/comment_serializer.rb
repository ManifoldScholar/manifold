# Provides a serialization of a comment  model.
class CommentSerializer < ApplicationSerializer
  include Abilities
  meta(partial: false)

  attributes :id, :body, :parent_id, :created_at, :flags_count, :flagged,
             :abilities, :deleted, :children_count, :sort_order

  belongs_to :creator

  def flagged
    return 0 unless authenticated?
    object.flags.where(creator: current_user).count.positive?
  end

  def deleted_body
    return object.body if can_read_deleted?
    nil
  end

  def body
    object.deleted == true ? deleted_body : object.body
  end
end
