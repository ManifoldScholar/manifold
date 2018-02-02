# Serializes the current User model
class CurrentUserSerializer < ActiveModel::Serializer
  include Authorization
  include AttributesForUser
  meta(partial: false)

  has_many :favorites, serializer: FavoriteSerializer
  has_many :makers, if: :can_update_object?
end
