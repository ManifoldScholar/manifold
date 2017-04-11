Sidekiq.configure_server do |config|
  config.redis = ManifoldEnv.redis.sidekiq_options
end

Sidekiq.configure_client do |config|
  config.redis = ManifoldEnv.redis.sidekiq_options
end
