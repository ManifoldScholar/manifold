# Provides a full serialization of a page model.
class PageFullSerializer < PageSerializer
  meta(partial: false)

  attributes :body
end
