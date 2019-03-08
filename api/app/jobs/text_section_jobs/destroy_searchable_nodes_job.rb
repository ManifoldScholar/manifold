module TextSectionJobs
  class DestroySearchableNodesJob < ApplicationJob

    def perform(searchable_node_ids)
      SearchableNode.where(id: searchable_node_ids).destroy_all
      Searchkick::ProcessQueueJob.perform_later class_name: "SearchableNode"
    end
  end
end
