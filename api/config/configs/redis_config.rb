# frozen_string_literal: true

class RedisConfig < ApplicationConfig
  env_prefix ""
  attr_config :redis_url, :boxen_redis_url, :rails_redis_url
  attr_config rails_redis_namespace: "manifold"

  def url
    default_url
  end

  def namespace(*parts)
    [namespace_prefix, *parts].join(":")
  end

  def namespaced_url(*parts)
    "#{url}/#{namespace(*parts)}"
  end

  def cache_options
    {
      namespace: namespace("cache"),
      url: url
    }
  end

  def sidekiq_options
    {
      url: url,
      namespace: "#{namespace('sidekiq')}:"
    }
  end

  def build_connection_pool(*namespace_parts, size: 5, timeout: 5)
    ConnectionPool.new size: size, timeout: timeout do
      build_connection(*namespace_parts)
    end
  end

  def build_connection(*namespace_parts)
    Redis::Namespace.new(namespace(*namespace_parts), redis: Redis.new(url: url))
  end

  private

  def namespace_prefix
    rails_redis_namespace
  end

  def default_url
    @url ||= (redis_url || boxen_redis_url || rails_redis_url || "redis://127.0.0.1:6379") # rubocop:disable Style/RedundantParentheses
    @url
  end
end
