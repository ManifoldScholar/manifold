module Content
  class MarkdownBlock < ::ContentBlock
    include Concerns::HasFormattedAttributes

    has_configured_attributes style: :string,
                              body: :string

    has_formatted_attribute :body, renderer_options: {
      filter_html: false,
      no_images: false,
      no_links: false,
      no_styles: false,
      hard_wrap: false
    }

    validates :body, presence: true
    validates :style, presence: true, inclusion: { in: %w(shaded normal) }
  end
end
