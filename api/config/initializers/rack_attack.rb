# frozen_string_literal: true

# Needs to run after initialization, else Solid Cache won't be ready
ActiveSupport::Reloader.to_prepare do
  # :nocov:
  # We want to ensure that the public IP used by the client is never
  # accidentally blocklisted or throttled.
  unless Rails.env.local?
    if ENV["CLIENT_SERVER_IP"]
      Rack::Attack.safelist_ip ENV["CLIENT_SERVER_IP"]
    else
      ManifoldEnv.rate_limiting.derive_public_ips! Rails.application.config.manifold.domain
    end
  end

  ManifoldEnv.rate_limiting.public_ips.each do |public_ip|
    Rack::Attack.safelist_ip public_ip
  end
  # :nocov:

  Rack::Attack.safelist("allow all GET requests") do |request|
    # We do not currently throttle GET requests.
    request.get?
  end

  Rack::Attack.safelist("mark any admin access safe") do |request|
    request.env["manifold_env.authorized_admin"]
  end

  Rack::Attack.safelist("skip when disabled globally or per category") do |request|
    request.env["manifold_env.rate_limiting_disabled"]
  end

  ManifoldEnv.rate_limiting.each_throttled_category do |throttler|
    Rack::Attack.throttle throttler.email_key, **throttler.options do |request|
      request.env["manifold_env.real_email"] if request.env["manifold_env.throttled_category"] == throttler.category
    end

    Rack::Attack.throttle throttler.ip_key, **throttler.options do |request|
      next unless request.env["manifold_env.throttled_category"] == throttler.category

      ENV.fetch("PROXY_CLIENT_IP_HEADER", "").split(/,\s*/).map do |header|
        request.get_header(header)
      end.push(request.env["action_dispatch.remote_ip"].to_s, request.ip)
         .compact_blank
         .first
    end
  end

  ActiveSupport::Notifications.subscribe("blocklist.rack_attack") do |name, start, finish, request_id, payload|
    # :nocov:
    ThrottledRequest.track! payload[:request]
    # :nocov:
  end

  ActiveSupport::Notifications.subscribe("throttle.rack_attack") do |name, start, finish, request_id, payload|
    # :nocov:
    ThrottledRequest.track! payload[:request]
    # :nocov:
  end

  Rack::Attack.blocklisted_responder = lambda do |request|
    # :nocov:
    [429, {}, ["Rate Limit Exceeded\n"]]
    # :nocov:
  end

  Rack::Attack.throttled_responder = lambda do |request|
    # :nocov:
    [429, {}, ["Rate Limit Exceeded\n"]]
    # :nocov:
  end
# Guards against db-not-ready states on first deploy. This initializer loads
# in db:prepare before migrations run, so Rails.cache.write above may hit a
# cache database that is missing or empty. Skipping is safe — the initializer
# reloads later in the boot sequence once migrations have completed.
#
#   NoDatabaseError  - cache database doesn't exist (fresh local deploys)
#   StatementInvalid - cache database exists but a queried table is missing
#   ArgumentError    - cache database exists but solid_cache_entries is not
#                      yet migrated; solid_cache's upsert_all raises this
#                      from its unique-index lookup before any SQL is issued
#                      (happens on fresh external-DB deploys, where we ask
#                      the operator to pre-create the cache database)
rescue ActiveRecord::NoDatabaseError, ActiveRecord::StatementInvalid, ArgumentError
  warn "Skipping rate limiting setup, no database yet."
end
