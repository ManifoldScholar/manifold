module ProjectCollectionJobs
  class QueueCacheCollectionProjectsJob < ApplicationJob
    def perform
      ProjectCollection.find_each do |project_collection|
        ProjectCollectionJobs::CacheCollectionProjectsJob.perform_later project_collection
      end
    end

  end
end
