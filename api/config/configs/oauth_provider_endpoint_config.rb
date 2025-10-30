# frozen_string_literal: true

class OauthProviderEndpointConfig < ApplicationConfig
  config_name :oauth_provider_endpoint
  attr_config :uri, :method, :query
end
