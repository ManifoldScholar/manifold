module Content
  class TextsBlock < ::ContentBlock
    include Concerns::HasFormattedAttributes

    config.required_render_attributes = %i{texts}.freeze

    has_formatted_attribute :description

    has_many_proxied :included_categories, source: "Category"

    has_configured_attributes show_authors: [:boolean, default: true],
                              show_descriptions: [:boolean, default: false],
                              show_subtitles: [:boolean, default: true],
                              show_covers: [:boolean, default: true],
                              show_dates: [:boolean, default: true],
                              show_category_labels: [:boolean, default: true],
                              show_uncategorized: [:boolean, default: true],
                              title: :string,
                              description: :text

    delegate :texts, to: :project, prefix: true

    validates :show_authors, :show_descriptions, :show_subtitles, :show_covers,
              :show_dates, :show_category_labels, inclusion: { in: [true, false] }

    def texts
      scope = project_texts
      scope = scope.by_category(included_categories) if included_categories.present?
      return scope unless show_uncategorized?

      scope.or(project_texts.uncategorized)
    end
  end
end
