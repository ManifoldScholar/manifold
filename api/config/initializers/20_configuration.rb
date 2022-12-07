class ConfigMash < Hashie::Mash
  disable_warnings
end

m = ConfigMash.new(Rails.application.config_for(:manifold))

# Load environment variables into configuration so we have a unified interface
# for accessing configuration that can be spread across a few locations.
ssl_enabled = %w(1 true).include?(ENV["SSL_ENABLED"].to_s.downcase)
m.ssl_enabled = ssl_enabled
m.protocol = ssl_enabled ? "https" : "http"
m.domain = ENV["DOMAIN"]
m.domain ||= "manifold.lvh" if Rails.env.development? || Rails.env.test?
m.url ||= ENV["CLIENT_URL"] || "#{ssl_enabled ? 'https' : 'http'}://#{m.domain}"
m.api_url ||= ENV["CLIENT_BROWSER_API_URL"] || m.url
m.elastic_search_url ||= ENV["ELASTICSEARCH_URL"]
m.mammoth_path ||= ENV["MAMMOTH_PATH"] || Rails.root.join("..", "client/node_modules/mammoth/bin/mammoth")

m.url_options = {
  protocol: m.protocol,
  host: m.domain
}

add_missing_mime = ->(definition, content_type) do
  definition[:allowed_mime] |= [content_type]
end

m.attachments.validations.each do |(type, definition)|
  # Ensure we import the original YAML manifest
  add_missing_mime[definition, "application/x-yaml"] if type == "resource"

  # Ensure text/markdown is present where it should be
  add_missing_mime[definition, "text/markdown"] if "application/markdown".in?(definition[:allowed_mime])
end

Rails.application.config.manifold = m
