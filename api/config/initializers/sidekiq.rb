Sidekiq.configure_server do |config|
  config.redis = { url: ENV["BOXEN_REDIS_URL"] || ENV["RAILS_REDIS_URL"] || "redis://127.0.0.1:6379" }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV["BOXEN_REDIS_URL"] || ENV["RAILS_REDIS_URL"] || "redis://127.0.0.1:6379" }
end
