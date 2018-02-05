# Provides a serialization of a category model.
class CategorySerializer < ApplicationSerializer
  meta(partial: false)

  attributes :id, :title, :position
end
