# frozen_string_literal: true

# :nocov:
# We want to ensure that the public IP used by the client is never
# accidentally blocklisted or throttled.
unless Rails.env.development? || Rails.env.test?
  ManifoldEnv.rate_limiting.derive_public_ips! Rails.application.config.manifold.domain
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
    request.ip if request.env["manifold_env.throttled_category"] == throttler.category
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
  [503, {}, ["Internal Server Error\n"]]
  # :nocov:
end

Rack::Attack.throttled_responder = lambda do |request|
  # :nocov:
  [503, {}, ["Internal Server Error\n"]]
  # :nocov:
end
