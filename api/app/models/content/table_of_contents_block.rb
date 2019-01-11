module Content
  class TableOfContentsBlock < ::ContentBlock

    has_one_proxied :text, source: "Text", required: true

    has_configured_attributes depth: :integer,
                              show_authors: [:boolean, default: false],
                              show_text_title: [:boolean, default: false]

    validates :depth,
              numericality: { min: 1, only_integer: true },
              allow_nil: true
    validates :show_authors, inclusion: { in: [true, false] }
    validates :show_text_title, inclusion: { in: [true, false] }
  end
end
