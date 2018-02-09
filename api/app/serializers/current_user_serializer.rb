# Serializes the current User model
class CurrentUserSerializer < ApplicationSerializer
  include AttributesForUser
  meta(partial: false)

  attributes :class_abilities

  has_many :favorites, serializer: FavoriteSerializer
end
