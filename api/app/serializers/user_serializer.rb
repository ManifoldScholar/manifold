# Serializes a User model
class UserSerializer < ApplicationSerializer

  meta(partial: false)
  attributes :id, :email, :nickname, :first_name, :last_name, :kind, :created_at,
             :role, :updated_at, :full_name, :avatar_styles, :abilities, :is_current_user

  def include_private_data?
    return false unless authenticated?

    object.updatable_by?(current_user) || current_user_is_creator?
  end

  def email
    return nil unless include_private_data?

    object.email
  end

  def created_at
    return nil unless include_private_data?

    object.created_at
  end

  def role
    return nil unless include_private_data?

    object.role
  end

  def kind
    return nil unless include_private_data?

    object.kind
  end

  def current_user?
    return false unless authenticated?

    object.id == current_user.id
  end
  alias is_current_user current_user?

end
