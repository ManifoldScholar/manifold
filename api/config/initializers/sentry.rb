# frozen_string_literal: true

require "sentry-rails"
require "sentry-ruby"
require "sentry-sidekiq"

Sentry.init do |config|
  config.dsn = ENV["SENTRY_DSN"]
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]
  config.enabled_environments = %w[princeton-manifold-friends princeton-manifold-production]
  config.debug = true
end
