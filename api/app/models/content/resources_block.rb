module Content
  class ResourcesBlock < ::ContentBlock

    config.required_render_attributes = %i{resources_or_collections}.freeze

    has_configured_attributes show_all_collections: [:boolean, { default: true }],
                              title: :string
    has_many_proxied :featured_collections, source: "ResourceCollection"

    def resources_or_collections
      project.resource_collections_count&.positive? || project.resources_count&.positive?
    end

  end
end
