module TextSectionJobs
  class GenerateSearchableNodesJob < ApplicationJob

    def perform(text_section_id)
      text_section = TextSection.find_by(id: text_section_id)
      return unless text_section.present?

      text_section.searchable_nodes.clear
      SearchableNode.import(text_section.properties_for_searchable_nodes)
      text_section.searchable_nodes.reload.reindex
    end
  end
end
