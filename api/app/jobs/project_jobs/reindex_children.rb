module ProjectJobs
  # Simple job to reindex a projects children in the background.
  class ReindexChildren < ApplicationJob
    queue_as :default

    def perform(project)
      project.reindex_children
    end
  end
end
