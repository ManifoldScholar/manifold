module ManifoldEnv
  class RedisConfig
    attr_reader :url

    # @param [String] url
    # @param [String] namespace_prefix
    def initialize(url: default_url, namespace_prefix: nil)
      @url = url
      @namespace_prefix = namespace_prefix || default_namespace_prefix
    end

    def namespace(*parts)
      [@namespace_prefix, *parts].join(":")
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

    def default_namespace_prefix
      ENV["RAILS_REDIS_NAMESPACE"] || "manifold"
    end

    def default_url
      ENV["BOXEN_REDIS_URL"] || ENV["RAILS_REDIS_URL"] || "redis://127.0.0.1:6379"
    end
  end
end
