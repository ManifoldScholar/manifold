# frozen_string_literal: true

module ManifoldEnv
  extend ActiveSupport::Autoload

  eager_autoload do
    autoload :DefinesRateLimits
    autoload :Introspection
    autoload :Introspector
    autoload :RateLimiting
    autoload :Types
  end

  mattr_accessor :rate_limiting do
    ManifoldEnv::RateLimiting.new
  end
end

ManifoldEnv.eager_load!
