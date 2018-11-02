module ProjectCollectionJobs
  class QueueCacheCollectionProjectsJob < ApplicationJob

    # rubocop:disable Metrics/LineLength
    def perform
      ProjectCollection.find_each do |project_collection|
        ProjectCollectionJobs::CacheCollectionProjectsJob.perform_later project_collection
      end
    end
    # rubocop:enable Metrics/LineLength

  end
end
