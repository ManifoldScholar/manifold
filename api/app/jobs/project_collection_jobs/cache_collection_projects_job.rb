module ProjectCollectionJobs
  class CacheCollectionProjectsJob < ApplicationJob

    # rubocop:disable Metrics/LineLength
    def perform(id)
      project_collection = ProjectCollection.find(id)
      return unless project_collection.present?
      ProjectCollections::CacheCollectionProjects.run project_collection: project_collection
    end
    # rubocop:enable Metrics/LineLength

  end
end
