module ProjectCollectionJobs
  class QueueCacheCollectionProjectsJob < ApplicationJob
    throttle threshold: 1, period: 5.minutes, drop: false

    # rubocop:disable Metrics/LineLength
    def perform
      ProjectCollection.find_each do |project_collection|
        ProjectCollectionJobs::CacheCollectionProjectsJob.perform_later project_collection
      end
    end
    # rubocop:enable Metrics/LineLength

  end
end
