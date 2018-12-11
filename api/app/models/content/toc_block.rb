module Content
  class TOCBlock < ::ContentBlock

    has_one_proxied :text, source: "Text", required: true

    jsonb_accessor :configuration,
                   depth: :integer,
                   show_authors: :boolean,
                   show_text_title: :boolean

    validates :depth,
              numericality: { only_integer: true }
    validates :show_authors, inclusion: { in: [true, false] }
    validates :show_text_title, inclusion: { in: [true, false] }
  end
end
