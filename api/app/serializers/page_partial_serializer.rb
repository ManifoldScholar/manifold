# Provides a serialization of a page model.
class PagePartialSerializer < ApplicationSerializer
  meta(partial: true)

  attributes :id, :slug, :title, :nav_title, :show_in_footer, :show_in_header,
             :created_at, :updated_at, :hidden, :body_formatted, :abilities,
             :purpose, :is_external_link, :external_link
end
