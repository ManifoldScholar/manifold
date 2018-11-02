module ProjectCollectionJobs
  class CacheCollectionProjectsJob < ApplicationJob

    # rubocop:disable Metrics/LineLength
    def perform(project_collection)
      ProjectCollections::CacheCollectionProjects.run project_collection: project_collection
    end
    # rubocop:enable Metrics/LineLength

  end
end
