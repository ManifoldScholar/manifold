# frozen_string_literal: true

require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
# require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
# require "action_mailbox/engine"
# require "action_text/engine"
require "action_view/railtie"
# require "sprockets/railtie"
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

require_relative "../lib/global_types/array_types"
require_relative "../lib/patches/support_websearch"

module ManifoldApi
  # Manifold main application
  class Application < Rails::Application
    # Configure the path for configuration classes that should be used before initialization
    # NOTE: path should be relative to the project root (Rails.root)
    # config.anyway_config.autoload_static_config_path = "config/configs"
    #

    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    config.autoload_paths += %W(#{config.root}/app/lib)

    config.action_mailer.delivery_method = :manifold_dynamic

    config.active_record.belongs_to_required_by_default = true

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
    config.i18n.load_path += Rails.root.glob('config/locales/**/*.{rb,yml}')
    # config.i18n.default_locale = :de

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    config.eager_load_paths += [
      "#{config.root}/app/jobs",
      "#{config.root}/app/models",
      "#{config.root}/app/operations",
      "#{config.root}/app/services",
      "#{config.root}/app/serializers",
      "#{config.root}/app/presenters",
      "#{config.root}/app/lib",
      "#{config.root}/app/enums"
    ]

    config.generators do |g|
      g.assets false
      g.helper false
      g.stylesheets false
      g.view_specs false
      g.integration_specs false

      g.orm :active_record, primary_key_type: :uuid
    end

    config.active_job.queue_adapter = :sidekiq

    config.active_record.schema_format = :sql

    config.cache_store = :redis_cache_store, ManifoldEnv.redis.cache_options
  end
end
