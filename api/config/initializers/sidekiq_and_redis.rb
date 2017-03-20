require "connection_pool"

url = ENV["BOXEN_REDIS_URL"] || ENV["RAILS_REDIS_URL"] || "redis://127.0.0.1:6379"
namespace = "manifold"

Sidekiq.configure_server do |config|
  config.redis = { url: url, namespace: "#{namespace}:sidekiq:" }
end

Sidekiq.configure_client do |config|
  config.redis = { url: url, namespace: "#{namespace}:sidekiq:" }
end

REDIS = ConnectionPool.new(size: 5) do
  Redis::Namespace.new(namespace, redis: Redis.new(url: url))
end
