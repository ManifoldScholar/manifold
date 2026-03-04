# frozen_string_literal: true

# @abstract
class AbstractOidcProviderConfig < AbstractAuthProviderConfig
  extend Dry::Core::ClassAttributes

  include ActiveModel::Validations

  defines :provider_name, type: Dry::Types["symbol"]

  strategy_name :openid_connect
  config_prefix :oidc

  config_name :_unused

  provider_name :_unused

  attr_config :issuer,
              :host,
              :scheme,
              :port,
              :client_id,
              :client_secret,
              discovery: true,
              response_type: :code,
              authorization_endpoint: nil,
              token_endpoint: nil,
              userinfo_endpoint: nil,
              jwks_uri: nil,
              end_session_endpoint: nil,
              scope: %w[openid email profile]

  def provider_options
    {
      name: provider_name,
      issuer:,
      response_type:,
      discovery:,
      scope:,
      client_options:
    }.compact
  end

  def client_options
    {
      host:,
      scheme: "http",
      port: 80,
      redirect_uri:,
      identifier: client_id,
      secret: client_secret,
      authorization_endpoint:,
      token_endpoint:,
      userinfo_endpoint:,
      jwks_uri:,
      end_session_endpoint:
    }.compact
  end

  def redirect_uri
    "#{Rails.application.config.manifold.api_url}/auth/#{provider_name}/callback"
  end

end
