module Content
  class ResourcesBlock < ::ContentBlock

    has_many_proxied :featured_collections, source: "Collection"
    has_many_proxied :featured_resources, source: "Resource"

    has_configured_attributes resources_count: :integer

    validates :resources_count,
              numericality: { only_integer: true },
              allow_nil: true
  end
end
