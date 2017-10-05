m = Hashie::Mash.new(Rails.application.config_for(:manifold))

# Load environment variables into configuration so we have a unified interface
# for accessing configuration that can be spread across a few locations.

m.url ||= "#{ENV['USE_SSL'].to_s == '1' ? 'https' : 'http'}://#{ENV['DOMAIN']}"
m.api_url ||= ENV["API_URL"]
m.elastic_search!.url ||= ENV["ELASTICSEARCH_URL"]

Rails.application.config.manifold = m
