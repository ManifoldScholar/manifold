class SearchableNode < ApplicationRecord

  belongs_to :text_section

  # Search
  searchkick callbacks: :async, batch_size: 500, highlight: [:content]

  def search_data
    {
      body: content,
      position: position,
      text_section_id: text_section_id,
      contains: contains,
      node_uuid: node_uuid
    }
  end

end
