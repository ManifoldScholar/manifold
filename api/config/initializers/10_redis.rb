# TODO: Revisit in v7, remove redis-namespace.
ENV["REDIS_NAMESPACE_QUIET"] = "true" # Disable deprecation warning
Redis::Objects.redis = ManifoldEnv.redis.build_connection_pool
