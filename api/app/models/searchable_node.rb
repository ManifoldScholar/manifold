class SearchableNode < ApplicationRecord

  belongs_to :text_section

  has_one :text, through: :text_section

  # Search
  searchkick(callbacks: :queue,
             batch_size: 500,
             highlight: [:title, :body])

  # rubocop:disable Metrics/LineLength
  scope :in_texts, ->(texts) { joins(:text_section).where(text_sections: { text: texts }) }
  # rubocop:enable Metrics/LineLength

  scope :search_import, lambda {
    includes(text_section: { text: [:project] })
  }

  def should_index?
    text_section.present? && text_section.should_index?
  end

  def search_data
    {
      body: content,
      text_section_id: text_section&.id,
      project_id: text_section&.text&.project_id,
      text_id: text_section&.text_id
    }.merge(search_hidden)
  end

  delegate :search_hidden, to: :text_section

  class << self
    def containing_sentence(text)
      sanitized = ActionView::Base.full_sanitizer.sanitize text

      query = arel_named_fn("plainto_tsquery", sanitized)

      body_vector = arel_named_fn("to_tsvector", "english", arel_table[:content])

      where arel_infix("@@", body_vector, query)
    end
  end
end
