# Provides a full serialization of a tag model.
class TagSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :name, :taggings_count
end
