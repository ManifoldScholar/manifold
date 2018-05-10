module TextSectionJobs
  class ReindexSearchableNodes < ApplicationJob

    def perform(text_section)
      return unless text_section.present?
      SearchableNode.searchkick_index.bulk_delete(text_section.searchable_nodes)
      text_section.searchable_nodes.clear
      SearchableNode.import(text_section.properties_for_searchable_nodes)
      text_section.searchable_nodes.reload.reindex
    end
  end
end
