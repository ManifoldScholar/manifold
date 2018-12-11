module Content
  class MarkdownBlock < ::ContentBlock
    jsonb_accessor :configuration,
                   style: :string

    validates :style, presence: true, inclusion: { in: %w(shaded normal) }
  end
end
