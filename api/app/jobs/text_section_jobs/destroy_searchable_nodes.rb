module TextSectionJobs
  class DestroySearchableNodes < ApplicationJob

    def perform(searchable_node_ids)
      to_destroy = SearchableNode.where(id: searchable_node_ids)
      return unless to_destroy.present?
      to_destroy.each(&:destroy)
    end
  end
end
