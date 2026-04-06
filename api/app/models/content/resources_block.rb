# frozen_string_literal: true

module Content
  class ResourcesBlock < ::ContentBlock
    include ::HasFormattedAttributes

    config.required_render_attributes = %i{resources_or_collections}.freeze

    has_formatted_attribute :description

    has_configured_attributes show_all_collections: [:boolean, { default: true }],
                              show_descriptions: [:boolean, { default: false }],
                              show_resources: [:boolean, { default: true }],
                              title: :string,
                              description: :text

    has_many_proxied :featured_collections, source: "ResourceCollection"

    has_many_proxied :featured_resources, source: "Resource"

    def resources_or_collections
      project.resource_collections_count&.positive? || project.resources_count&.positive?
    end
  end
end
