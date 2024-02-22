# frozen_string_literal: true

module SettingSections
  # Secrets for the Manifold installation.
  #
  # These will all be redacted when being sent to the API.
  #
  # @see SettingSections::Integrations
  class Secrets < Base
    attribute :akismet_api_key, :string
    attribute :facebook_app_secret, :string
    attribute :google_private_key, :string
    attribute :smtp_settings_password, :string
    attribute :twitter_app_secret, :string
    attribute :twitter_access_token_secret, :string

    # Used by OAuth provider, but not exposed in the API.
    attribute :google_oauth_client_secret, :string

    redact_all!
  end
end
