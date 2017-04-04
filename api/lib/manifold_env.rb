require_relative "./manifold_env/redis_config"

module ManifoldEnv
  mattr_accessor :redis do
    ManifoldEnv::RedisConfig.new
  end
end
