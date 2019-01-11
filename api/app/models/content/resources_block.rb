module Content
  class ResourcesBlock < ::ContentBlock

    has_many_proxied :featured_collections, source: "Collection"

    has_configured_attributes show_collections: :boolean

  end
end
