module Content
  class ResourcesBlock < ::ContentBlock

    has_configured_attributes show_all_collections: :boolean,
                              title: :string
    has_many_proxied :featured_collections, source: "Collection"

  end
end
