# frozen_string_literal: true

Rails.application.configure do
  # Future-proofing
  config.good_job.smaller_number_is_higher_priority = true

  queues = [
    "maintenance:1",
    "default,mailers,processing,sorting,url_validity:3",
  ].join(?;)

  config.good_job.cleanup_preserved_jobs_before_seconds_ago = 43_200 # half-day
  config.good_job.preserve_job_records = true
  config.good_job.retry_on_unhandled_error = false
  config.good_job.on_thread_error = ->(exception) { Rollbar.error(exception) }
  config.good_job.execution_mode = :external
  config.good_job.queues = queues
  config.good_job.max_threads = 5
  config.good_job.poll_interval = 30 # seconds
  config.good_job.shutdown_timeout = 25 # seconds
  config.good_job.enable_cron = true
  config.good_job.cron = {
    "feed.refresh_feed": {
      cron: "0 * * * *",
      class: "FeedRefreshJob",
      description: "Refresh the opportunity feed.",
    },
    "opportunities.archive_expired": {
      cron: "55 * * * *",
      class: "Opportunities::ArchiveExpiredJob",
      description: "Automatically archive expired opportunities",
    },
    "opportunities.calculate_all_sorting": {
      cron: "0 1,13 * * *",
      class: "Opportunities::CalculateAllSortingJob",
      description: "Calculate sorting for all opportunities",
    },
    "opportunities.check_all_url_validity": {
      cron: "0 0,4,8,12,16,20 * * *",
      class: "Opportunities::CheckAllURLValidityJob",
      description: "Check the URL Validity of all opportunities",
    },
    "resources.maintain": {
      cron: "*/5 * * * *",
      class: "Resources::MaintainJob",
      description: "Maintain resources",
    },
    "sources.calculate_counter_caches": {
      cron: "*/10 * * * *",
      class: "Sources::CalculateCounterCaches",
      description: "Refresh counter caches on Sources",
    },
  }

  config.good_job.dashboard_default_locale = :en
end

