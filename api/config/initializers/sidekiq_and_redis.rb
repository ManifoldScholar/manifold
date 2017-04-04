Sidekiq.configure_server do |config|
  config.redis = ManifoldEnv.redis.sidekiq_options
end

Sidekiq.configure_client do |config|
  config.redis = ManifoldEnv.redis.sidekiq_options
end

REDIS = ConnectionPool.new(size: 5) do
  Redis::Namespace.new(namespace, redis: Redis.new(url: ManifoldEnv.redis.url))
end
