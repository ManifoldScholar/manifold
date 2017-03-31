module ManifoldEnv
  extend ActiveSupport::Autoload

  eager_autoload do
    autoload :HasConfigurationDSL
    autoload :OauthConfig
    autoload :OauthProvider
    autoload :RedisConfig
  end

  mattr_accessor :oauth do
    ManifoldEnv::OauthConfig.new
  end

  mattr_accessor :redis do
    ManifoldEnv::RedisConfig.new
  end
end

ManifoldEnv.eager_load!
