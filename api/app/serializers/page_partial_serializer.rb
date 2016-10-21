# Provides a serialization of a page model.
class PagePartialSerializer < ActiveModel::Serializer
  attributes :id, :slug, :title, :nav_title
end
