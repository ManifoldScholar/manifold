# Serializes a Text model
class UserSerializer < ActiveModel::Serializer
  include Authorization
  meta(partial: false)

  attributes :id, :email, :nickname, :first_name, :last_name, :role, :created_at,
             :updated_at, :full_name, :avatar_styles, :is_current_user, :persistent_ui

  def current_user?
    user_id = scope.try(:authenticated_as).try(:id)
    return false unless user_id
    object.id == user_id
  end
  alias is_current_user current_user?

  has_many :favorites, serializer: FavoriteSerializer
  has_many :makers, if: :can_update_object?
end
