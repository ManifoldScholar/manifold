module Content
  class TableOfContentsBlock < ::ContentBlock

    config.required_render_attributes = %i{text}.freeze

    has_one_proxied :text, source: "Text"

    has_configured_attributes depth: [:integer, { default: 6 }],
                              title: :string,
                              show_authors: [:boolean, { default: false }],
                              show_text_title: [:boolean, { default: false }]

    validates :depth,
              numericality: { min: 1, less_than_or_equal_to: 6, only_integer: true },
              allow_nil: true
    validates :show_authors, inclusion: { in: [true, false] }
    validates :show_text_title, inclusion: { in: [true, false] }
  end
end
