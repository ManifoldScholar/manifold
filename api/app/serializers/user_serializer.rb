# Serializes a User model
class UserSerializer < ApplicationSerializer

  meta(partial: false)
  attributes :id, :email, :nickname, :first_name, :last_name, :kind, :created_at,
             :role, :updated_at, :full_name, :avatar_styles, :abilities, :is_current_user

  def current_user?
    return false unless authenticated?
    object.id == current_user.id
  end
  alias is_current_user current_user?

end
