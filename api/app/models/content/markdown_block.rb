module Content
  class MarkdownBlock < ::ContentBlock
    include Concerns::HasFormattedAttributes

    has_configured_attributes style: :string,
                              body: :string

    has_formatted_attribute :body

    validates :body, presence: true
    validates :style, presence: true, inclusion: { in: %w(shaded normal) }
  end
end
