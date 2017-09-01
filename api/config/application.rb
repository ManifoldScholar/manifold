require File.expand_path("../boot", __FILE__)

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "action_cable/engine"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "active_record/railtie"
require "rails/test_unit/railtie"
require "dynamic_mailer/mailer"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

# We're monkey patching dotenv's load method to load the .env file from the parent
# directory.
module Dotenv
  # Monkey Patch
  class Railtie < Rails::Railtie
    def load
      Dotenv.load(
        root.join("../.env.local"),
        root.join("../.env.#{Rails.env}"),
        root.join("../.env")
      )
    end
  end
end
Dotenv::Railtie.load

# Make sure this is included _after_ the environment is setup.
require_relative "../lib/manifold_env"

ActionMailer::Base.add_delivery_method :manifold_dynamic, DynamicMailer::Mailer

module ManifoldApi
  # Manifold main application
  class Application < Rails::Application

    config.action_mailer.delivery_method = :manifold_dynamic

    config.active_record.belongs_to_required_by_default = true

    # TODO: Abstract this into env
    config.action_cable.allowed_request_origins = [ENV["CLIENT_URL"]]

    # Settings in config/environments/* take precedence over those specified
    # here. Application configuration should go into files in
    # config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record
    # auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names.
    # Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from
    # config/locales/*.rb,yml are auto loaded.
    config.i18n.load_path += Dir[Rails.root.join("config",
                                                 "locales", "**", "*.{rb,yml}")]
    # config.i18n.default_locale = :de

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    config.eager_load_paths += [
      "#{config.root}/app/jobs",
      "#{config.root}/app/services",
      "#{config.root}/app/presenters",
      "#{config.root}/app/lib"
    ]

    config.active_job.queue_adapter = :sidekiq

    config.cache_store = :redis_store, ManifoldEnv.redis.namespaced_url("cache")
  end
end
