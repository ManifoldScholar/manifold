module V1
  module Content
    class TextsBlockSerializer < ContentBlockSerializer

      typed_attribute :show_authors, NilClass
      typed_attribute :show_descriptions, NilClass
      typed_attribute :show_subtitles, NilClass
      typed_attribute :show_covers, NilClass
      typed_attribute :show_dates, NilClass
      typed_attribute :show_category_labels, NilClass
      typed_attribute :title, NilClass
      typed_attribute :show_uncategorized, NilClass
      typed_attribute :description, NilClass
      typed_attribute :description_formatted, NilClass

      typed_has_many :included_categories, record_type: :category
      typed_has_many :texts
    end
  end
end
