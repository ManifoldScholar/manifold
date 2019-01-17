module Content
  class TextsBlock < ::ContentBlock
    include Concerns::HasFormattedAttributes

    has_formatted_attribute :description

    has_many_proxied :included_categories, source: "Category"

    has_configured_attributes show_authors: [:boolean, default: false],
                              show_descriptions: [:boolean, default: false],
                              show_subtitles: [:boolean, default: false],
                              show_covers: [:boolean, default: false],
                              show_dates: [:boolean, default: false],
                              show_category_labels: [:boolean, default: false],
                              title: :string,
                              description: :text

    validates :show_authors, :show_descriptions, :show_subtitles, :show_covers,
              :show_dates, :show_category_labels, inclusion: { in: [true, false] }

    def texts
      if included_categories.present?
        project.texts.where(category: included_categories)
      else
        project.texts
      end
    end
  end
end
