# frozen_string_literal: true

Rails.application.configure do
  # Future-proofing
  config.good_job.smaller_number_is_higher_priority = true

  queues = [
    "+default,mailers,deletions,low_priority,ahoy,annotations:10",
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
    "caches.refresh_project_collections": {
      cron: "*/15 * * * *",
      class: "::ProjectCollectionJobs::QueueCacheCollectionProjectsJob"
    },
    "caches.refresh_all_flag_status_data": {
      cron: "*/10 * * * *",
      class: "::Flags::RefreshAllStatusDataJob"
    },
    "entitlements.audit": {
      cron: "*/15 * * * *",
      class: "Entitlements::AuditJob"
    },
    "entitlements.check_expiration": {
      cron: "0 * * * *",
      class: "Entitlements::CheckExpirationJob"
    },
    "uploads.expire_shrine_cache": {
      cron: "* * 0 * *",
      class: "ExpireShrineCacheJob"
    },
    "uploads.expire_tus_uploads": {
      cron: "* * 0 * *",
      class: "ExpireTusUploadsJob"
    },
    "notifications.enqueue_user_daily_digests": {
      cron: "* 6 * * *",
      class: "Notifications::EnqueueDigestsJob"
    },
    "notifications.enqueue_user_weekly_digests": {
      cron: "* 6 * * 0",
      class: "Notifications::EnqueueDigestsJob"
    },
    "packaging.automate_text_exports": {
      cron: "*/5 * * * *",
      class: "Texts::AutomateExportsJob"
    },
    "packaging.prune_text_exports": {
      cron: "* 1 * * *",
      class: "TextExports::PruneJob"
    },
    "packaging.prune_project_exports": {
      cron: "5 1 * * *",
      class: "ProjectExports::PruneJob"
    },
    "packaging.prune_bag_it_temporary_directory": {
      cron: "* */4 * * *",
      class: "Packaging::BagItSpec::PruneTemporaryDirectoryJob"
    }
  }

  config.good_job.dashboard_default_locale = :en
end
