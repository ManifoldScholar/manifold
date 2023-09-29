require "./config/boot"
require "./config/environment"

Zhong.redis = Redis.new(url: ENV["RAILS_REDIS_URL"])

Zhong.schedule do
  category "caches" do
    every(15.minutes, "refresh_project_collections") do
      ::ProjectCollectionJobs::QueueCacheCollectionProjectsJob.perform_later
    end
  end

  category "entitlements" do
    every(15.minutes, "audit") do
      Entitlements::AuditJob.perform_later
    end

    every(1.hour, "check_expiration") do
      Entitlements::CheckExpirationJob.perform_later
    end
  end

  category "uploads" do
    every(1.day, "expire_shrine_cache", at: "22:00", tz: "America/Los_Angeles") do
      ExpireShrineCacheJob.perform_later
    end

    every(1.day, "expire_tus_uploads", at: "23:00", tz: "America/Los_Angeles") do
      ExpireTusUploadsJob.perform_later
    end
  end

  category "notification" do
    every(1.day, "enqueue_user_daily_digests", at: "06:00") do
      Notifications::EnqueueDigestsJob.perform_later "daily"
    end

    every(1.week, "enqueue_user_weekly_digests", at: "Sunday 06:00") do
      Notifications::EnqueueDigestsJob.perform_later "weekly"
    end
  end

  category "packaging" do
    every(5.minutes, "automate_text_exports") do
      Texts::AutomateExportsJob.perform_later
    end

    every(1.day, "prune_text_exports", at: "01:00") do
      TextExports::PruneJob.perform_later
    end

    every(1.day, "prune_project_exports", at: "01:05") do
      ProjectExports::PruneJob.perform_later
    end

    every(4.hours, "prune_bag_it_temporary_directory") do
      Packaging::BagItSpec::PruneTemporaryDirectoryJob.perform_later
    end
  end
end
