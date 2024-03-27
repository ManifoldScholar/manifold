# frozen_string_literal: true

require_relative "../manifold_env/types"

namespace :rate_limiting do
  desc "Reset the cache and all counters for rate limiting"
  task reset: :environment do
    Rack::Attack.reset!

    warn "Rate-limiting cache cleared"
  end

  desc "Print the status of rate-limiting settings"
  task status: :environment do
    puts Settings.instance.rate_limiting.status_table
  end

  namespace :all do
    desc "Enable all rate-limiters, clearing any specific category disable states"
    task enable: :environment do
      Settings.instance.enable_rate_limiting!(:all)

      warn "Enabled rate limiting globally as well as for all categories"
    end

    desc "Disable rate-limiters globally. This will not change the per-category states, but simply override them."
    task disable: :environment do
      Settings.instance.disable_rate_limiting!(:all)

      warn "Disabled rate-limiting globally"
    end
  end

  ManifoldEnv::Types::THROTTLED_CATEGORIES.each do |category|
    human = category.to_s.humanize(capitalize: false)

    namespace category do
      desc "Enable rate-limiting for #{human}"
      task enable: :environment do
        settings = Settings.instance
        settings.enable_rate_limiting!(category)

        warn "Enabled rate-limiting for #{human}"

        if settings.rate_limiting.disabled?
          warn "**NOTE**: Rate-limiting is disabled globally. This setting has no effect while that is true."
        end
      end

      desc "Disable rate-limiting for #{human}"
      task disable: :environment do
        settings = Settings.instance
        settings.disable_rate_limiting!(category)

        warn "Disabled rate-limiting for #{human}"
      end
    end
  end
end
