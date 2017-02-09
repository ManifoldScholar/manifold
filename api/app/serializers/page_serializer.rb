# Provides a serialization of a page model.
class PageSerializer < PagePartialSerializer
  meta(partial: false)

  attributes :body
end
