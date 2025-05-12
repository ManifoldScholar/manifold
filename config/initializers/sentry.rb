# frozen_string_literal: true

require 'sentry-rails'
require 'sentry-ruby'
require 'sentry-sidekiq'

Sentry.init do |config|
  config.dsn = ENV['SENTRY_DSN']
  config.environment = ENV['SENTRY_ENVIRONMENT']
  config.breadcrumbs_logger = [:active_support_logger, :http_logger, :sentry_logger]
  config.enabled_environments = %w[hykuup-knapsack-staging hykuup-knapsack-production]
  config.debug = true
end