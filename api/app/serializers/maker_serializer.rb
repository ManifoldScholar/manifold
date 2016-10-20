# Provides a partial serialization of a maker model.
class MakerSerializer < ActiveModel::Serializer
  cache key: "maker", expires_in: 3.hours
  attributes :id, :first_name, :last_name, :middle_name, :display_name, :avatar_url,
             :full_name
end
