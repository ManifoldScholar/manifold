# Includes serializer authorization
module Authorization
  extend ActiveSupport::Concern

  def can_update_object?
    scope.try(:authenticated_as).try(:can_update?, object)
  end
  alias can_update_object can_update_object?

  def can_delete_object?
    scope.try(:authenticated_as).try(:can_delete?, object)
  end
  alias can_delete_object can_delete_object?

  def current_user_is_creator
    user_id = scope.try(:authenticated_as).try(:id)
    return false unless user_id
    return false unless object.creator_id
    user_id == object.creator_id
  end
end
