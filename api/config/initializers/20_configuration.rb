m = Hashie::Mash.new(Rails.application.config_for(:manifold))

# Load environment variables into configuration so we have a unified interface
# for accessing configuration that can be spread across a few locations.
ssl_enabled = %w(1 true).include?(ENV["SSL_ENABLED"].to_s.downcase)
m.domain = ENV["DOMAIN"]
m.url ||= "#{ssl_enabled ? 'https' : 'http'}://#{m.domain}"
m.api_url ||= ENV["CLIENT_BROWSER_API_URL"] || m.url
m.elastic_search!.url ||= ENV["ELASTICSEARCH_URL"]

Rails.application.config.manifold = m
