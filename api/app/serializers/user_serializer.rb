# Serializes a Text model
class UserSerializer < ActiveModel::Serializer
  cache key: "user", expires_in: 3.hours
  attributes :id, :email, :nickname, :first_name, :last_name, :role, :created_at,
             :updated_at, :avatar_url
end
