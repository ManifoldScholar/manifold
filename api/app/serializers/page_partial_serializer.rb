# Provides a serialization of a page model.
class PagePartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :id, :slug, :title, :nav_title, :show_in_footer
end
