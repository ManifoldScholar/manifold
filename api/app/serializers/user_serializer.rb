# Serializes a User model
class UserSerializer < ApplicationSerializer
  include AttributesForUser
  meta(partial: false)

  attributes :is_current_user

  def current_user?
    return false unless authenticated?
    object.id == current_user.id
  end
  alias is_current_user current_user?
end
