# Provides a serialization of a page model.
class PagePartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :id, :slug, :title, :nav_title, :show_in_footer, :show_in_header,
             :created_at, :updated_at, :hidden, :body_formatted
end
