class SearchableNode < ApplicationRecord

  belongs_to :text_section

  # Search
  searchkick(callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  scope :in_texts, lambda { |texts|
    joins(text_section: :text).where("texts.id" => texts)
  }

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

end
