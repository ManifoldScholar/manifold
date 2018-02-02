# Serializes a User model
class UserSerializer < ActiveModel::Serializer
  include Authorization
  include AttributesForUser
  meta(partial: false)

  attributes :is_current_user

  has_many :makers, if: :can_update_object?

  def current_user?
    return false unless authenticated?
    object.id == current_user.id
  end
  alias is_current_user current_user?
end
