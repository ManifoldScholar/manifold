module ManifoldEnv
  class RedisConfig
    attr_reader :url

    # @param [String] url
    # @param [String] namespace_prefix
    def initialize(url: default_url, namespace_prefix: "manifold")
      @url = url
      @namespace_prefix = namespace_prefix
    end

    def namespace(*parts)
      [@namespace_prefix, *parts].join(":")
    end

    def namespaced_url(*parts)
      "#{url}/#{namespace(*parts)}"
    end

    def sidekiq_options
      {
        url: url,
        namespace: "#{namespace('sidekiq')}:"
      }
    end

    private

    def default_url
      ENV["BOXEN_REDIS_URL"] || ENV["RAILS_REDIS_URL"] || "redis://127.0.0.1:6379"
    end
  end
end
