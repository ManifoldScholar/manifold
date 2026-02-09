# frozen_string_literal: true

module ManifoldEnv
  extend ActiveSupport::Autoload

  eager_autoload do
    autoload :CustomOauthEndpoint
    autoload :CustomOauthProvider
    autoload :DefinesRateLimits
    autoload :HasConfigurationDSL
    autoload :Introspection
    autoload :Introspector
    autoload :OauthConfig
    autoload :OauthProvider
    autoload :RateLimiting
    autoload :Types
  end

  mattr_accessor :oauth do
    ManifoldEnv::OauthConfig.new
  end

  mattr_accessor :rate_limiting do
    ManifoldEnv::RateLimiting.new
  end
end

ManifoldEnv.eager_load!
