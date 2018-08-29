require "clockwork"
require "./config/boot"
require "./config/environment"

# This file contains configuration for our background jobs run via Clockwork.
module Clockwork
  every(1.hour, "queue_fetch_project_tweets") { ::QueueFetchProjectTweets.perform_later }
  every(4.hours, "update_statistics") { ::UpdateAnalyticsCache.perform_later }
  every(1.day, "expire_shrine_cache", at: "22:00", tz: "America/Los_Angeles") do
    ExpireShrineCacheJob.perform_later
  end
  every(1.day, "expire_tus_uploads", at: "23:00", tz: "America/Los_Angeles") do
    ExpireTusUploadsJob.perform_later
  end
  every(1.day, "enqueue_user_daily_digests", at: "06:00") do
    Notifications::EnqueueDigestsJob.perform_later "daily"
  end
  every(1.week, "enqueue_user_weekly_digests", at: "Sunday 06:00") do
    Notifications::EnqueueDigestsJob.perform_later "weekly"
  end
end
