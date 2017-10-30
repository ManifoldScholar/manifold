require "clockwork"
require "./config/boot"
require "./config/environment"

# This file contains configuration for our background jobs run via Clockwork.
module Clockwork
  handler do |job|
    case job
    when "queue_fetch_project_tweets"
      ::QueueFetchProjectTweets.perform_later
    when "update_statistics"
      ::UpdateAnalyticsCache.perform_later
    when "prune_unassociated_subjects"
      ::Subjects::PruneUnassociatedJob.perform_later
    end
  end

  every(1.hour, "queue_fetch_project_tweets")
  every(4.hours, "update_statistics")
  every(1.day, "prune_unassociated_subjects")
end
