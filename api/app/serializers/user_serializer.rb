# Serializes a Text model
class UserSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :email, :nickname, :first_name, :last_name, :role, :created_at,
             :updated_at, :avatar_url

  has_many :favorites, serializer: FavoriteSerializer
end
