class SearchableNodeSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :text_section_id, :node_uuid, :content, :contains
end
