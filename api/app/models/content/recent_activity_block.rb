# frozen_string_literal: true

module Content
  class RecentActivityBlock < ::ContentBlock
    config.required_render_attributes = %i{has_activity}.freeze

    # This gets exposed as is to the client, and we don't really want hash keys with
    # question marks on the client side.
    def has_activity
      project.events.count.positive?
    end
  end
end
