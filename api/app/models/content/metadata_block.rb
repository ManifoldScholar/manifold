# frozen_string_literal: true

module Content
  class MetadataBlock < ::ContentBlock
    config.required_render_attributes = %i{has_metadata}.freeze

    # This gets exposed as is to the client, and we don't really want hash keys with
    # question marks on the client side.
    def has_metadata
      project.metadata.count.positive?
    end
  end
end
