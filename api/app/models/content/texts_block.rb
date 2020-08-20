module Content
  class TextsBlock < ::ContentBlock

    include ::HasFormattedAttributes

    config.required_render_attributes = %i{has_texts}.freeze

    has_formatted_attribute :description

    has_many_proxied :included_categories, source: "Category"

    has_configured_attributes show_authors: [:boolean, { default: true }],
                              show_descriptions: [:boolean, { default: false }],
                              show_subtitles: [:boolean, { default: true }],
                              show_covers: [:boolean, { default: true }],
                              show_dates: [:boolean, { default: true }],
                              show_category_labels: [:boolean, { default: true }],
                              show_uncategorized: [:boolean, { default: true }],
                              title: :string,
                              description: :text

    delegate :texts, to: :project, prefix: true

    validates :show_authors, :show_descriptions, :show_subtitles, :show_covers,
              :show_dates, :show_category_labels, inclusion: { in: [true, false] }

    # rubocop:disable Naming/PredicateName
    def has_texts
      scope = project_texts
      scope = scope.by_category(included_categories) if included_categories.present?
      return scope unless show_uncategorized?

      scope.or(project_texts.uncategorized)
      scope.count.positive?
    end
    # rubocop:enable Naming/PredicateName

    def text_ids
      texts.group(:id).pluck(:id)
    end

    def texts
      scope = project_texts
      scope = scope.by_category(included_categories) if included_categories.present?
      return scope unless show_uncategorized?

      scope.or(project_texts.uncategorized)
    end
  end
end
