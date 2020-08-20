module Content
  class MarkdownBlock < ::ContentBlock

    config.required_render_attributes = %i{style body}.freeze

    include ::HasFormattedAttributes

    has_configured_attributes style: [:string, { default: "normal" }],
                              body: :string

    has_formatted_attribute :body, renderer_options: {
      filter_html: false,
      no_images: false,
      no_links: false,
      no_styles: false,
      hard_wrap: false
    }

    validates :style, presence: true, inclusion: { in: %w(shaded normal) }
  end
end
