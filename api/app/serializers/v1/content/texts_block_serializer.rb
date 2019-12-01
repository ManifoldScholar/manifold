module V1
  module Content
    class TextsBlockSerializer < ContentBlockSerializer

      attributes :show_authors, :show_descriptions, :show_subtitles, :show_covers,
                 :show_dates, :show_category_labels, :title, :show_uncategorized,
                 :description, :description_formatted

      has_many :included_categories, record_type: "category"
      has_many :texts
    end
  end
end
