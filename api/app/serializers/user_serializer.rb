# Serializes a Text model
class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :nickname, :first_name, :last_name, :role, :created_at,
             :updated_at, :avatar_url
end
