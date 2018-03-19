module ProjectJobs
  # Simple job to reindex a projects children in the background.
  class ReindexChildren < ApplicationJob
    queue_as :default

    def perform(project_id)
      project = Project.find(project_id)
      project.reindex_children
    end
  end
end
