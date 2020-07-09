module ProjectCollectionJobs
  class CacheCollectionProjectsJob < ApplicationJob
    def perform(project_collection)
      ProjectCollections::CacheCollectionProjects.run project_collection: project_collection
    end

  end
end
