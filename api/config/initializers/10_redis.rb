# frozen_string_literal: true

# TODO: Revisit in v7, remove redis-namespace.
ENV["REDIS_NAMESPACE_QUIET"] = "true" # Disable deprecation warning
Redis::Objects.redis = RedisConfig.build_connection_pool
