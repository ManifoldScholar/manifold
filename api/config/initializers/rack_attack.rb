# frozen_string_literal: true

require "auth_token"

EMPTY_PARAMS = {}.with_indifferent_access.freeze

JSON_PARAMS_FROM = ->(request) do
  params = JSON.parse(request.body)

  params.try(:with_indifferent_access) || EMPTY_PARAMS
rescue JSON::ParserError
  EMPTY_PARAMS
ensure
  request.body.rewind
end

IS_COMMENT_CREATE = ->(request) do
  request.post? && request.path.include?("/relationships/comments")
end

IS_PUBLIC_ANNOTATION_CREATE = ->(request) do
  return false unless request.post? && request.path.include?("/relationships/annotations")

  params = JSON_PARAMS_FROM.(request)

  params.dig("data", "attributes", "private").blank?
end

IS_PUBLIC_RG_CREATE = ->(request) do
  return false unless request.post? && request.path.start_with?("/api/v1/reading_groups")

  params = JSON_PARAMS_FROM.(request)

  params.dig("data", "attributes", "privacy") != "private"
end

Rack::Attack.safelist("mark any admin access safe") do |request|
  AuthToken.authorized_admin?(request.env["HTTP_AUTHORIZATION"])
end

ANN_LIMITS = { limit: 5, period: 300, }.freeze

Rack::Attack.throttle("public annotation creation by email", **ANN_LIMITS) do |request|
  AuthToken.real_email_for(request.env["HTTP_AUTHORIZATION"]) if IS_PUBLIC_ANNOTATION_CREATE.(request)
end

Rack::Attack.throttle("public annotation creation by ip", **ANN_LIMITS) do |request|
  request.ip if IS_PUBLIC_ANNOTATION_CREATE.(request)
end

COMMENT_LIMITS = { limit: 10, period: 3600, }.freeze

Rack::Attack.throttle("comment creation by email", **COMMENT_LIMITS) do |request|
  AuthToken.real_email_for(request.env["HTTP_AUTHORIZATION"]) if IS_COMMENT_CREATE.(request)
end

Rack::Attack.throttle("comment creation by ip", **COMMENT_LIMITS) do |request|
  request.ip if IS_COMMENT_CREATE.(request)
end

RG_LIMITS = { limit: 10, period: 3600, }.freeze

Rack::Attack.throttle("public reading group creation by email", **RG_LIMITS) do |request|
  AuthToken.real_email_for(request.env["HTTP_AUTHORIZATION"]) if IS_PUBLIC_RG_CREATE.(request)
end

Rack::Attack.throttle("public reading group creation by ip", **RG_LIMITS) do |request|
  request.ip if IS_PUBLIC_RG_CREATE.(request)
end

Rack::Attack.blocklist("allow2ban registration by email") do |req|
  params = JSON_PARAMS_FROM.(req)

  real_email = AuthToken.real_email_from(params.dig("data", "attributes", "email"))

  Rack::Attack::Allow2Ban.filter(real_email, maxretry: 5, findtime: 1.day, bantime: 1.month) do
    req.path.start_with?("/api/v1/users") && req.post?
  end
end

Rack::Attack.blocklist("allow2ban registration by ip") do |req|
  Rack::Attack::Allow2Ban.filter(req.ip, maxretry: 5, findtime: 1.day, bantime: 1.month) do
    req.path.start_with?("/api/v1/users") && req.post?
  end
end

ActiveSupport::Notifications.subscribe("blocklist.rack_attack") do |name, start, finish, request_id, payload|
  ThrottledRequest.track! payload[:request]
end

ActiveSupport::Notifications.subscribe("throttle.rack_attack") do |name, start, finish, request_id, payload|
  ThrottledRequest.track! payload[:request]
end

Rack::Attack.blocklisted_responder = lambda do |request|
  [503, {}, ["Internal Server Error\n"]]
end

Rack::Attack.throttled_responder = lambda do |request|
  [503, {}, ["Internal Server Error\n"]]
end
