m = Hashie::Mash.new(Rails.application.config_for(:manifold))

# Load environment variables into configuration so we have a unified interface
# for accessing configuration that can be spread across a few locations.
m.api_url ||= ENV["API_URL"]
m.elastic_search!.url ||= ENV["ELASTICSEARCH_URL"]
m.twitter!.consumer_key        ||= ENV["TWITTER_CONSUMER_KEY"]
m.twitter!.consumer_secret     ||= ENV["TWITTER_CONSUMER_SECRET"]
m.twitter!.access_token        ||= ENV["TWITTER_ACCESS_TOKEN"]
m.twitter!.access_token_secret ||= ENV["TWITTER_ACCESS_TOKEN_SECRET"]
m.google!.service_project_id     ||= ENV["GOOGLE_SERVICE_PROJECT_ID"]
m.google!.service_private_key_id ||= ENV["GOOGLE_SERVICE_PRIVATE_KEY_ID"]
m.google!.service_private_key    ||= ENV["GOOGLE_SERVICE_PRIVATE_KEY"]
m.google!.client_email           ||= ENV["GOOGLE_SERVICE_CLIENT_EMAIL"]
m.google!.service_client_id      ||= ENV["GOOGLE_SERVICE_CLIENT_ID"]
m.settings!.general!.ga_tracking_id ||= ENV["MANIFOLD_SETTING_GENERAL_GA_TRACKING_ID"]
m.settings!.general!.ga_profile_id  ||= ENV["MANIFOLD_SETTING_GENERAL_GA_PROFILE_ID"]
m.settings!.theme!.typekit_id       ||= ENV["MANIFOLD_SETTING_THEME_TYPEKIT_ID"]

# Look for keys in the keys directory.
google_private_key =
  Rails.application.root.join("..", "config", "keys", "google_service_private_key.key")
if File.exist?(google_private_key)
  m.google!.service_private_key = File.read(google_private_key)
end

Rails.application.config.manifold = m
