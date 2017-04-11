class Settings < ApplicationRecord
  class UpdateOauthProviders < ActiveInteraction::Base
    object :settings, default: proc { Settings.instance }

    PROVIDER_MAPPING = {
      facebook: %i(facebook_app_id facebook_app_secret),
      google:   %i(google_oauth_client_id google_oauth_client_secret),
      twitter:  %i(twitter_app_id twitter_app_secret)
    }.freeze

    def execute
      PROVIDER_MAPPING.each do |provider_name, (app_id_key, secret_key)|
        provider = ManifoldEnv.oauth[provider_name]

        provider.app_id = settings.integrations[app_id_key]
        provider.secret = settings.secrets[secret_key]
      end
    rescue ManifoldEnv::OauthConfig::UnknownProvider => e
      errors.add :base, e.message
    end
  end
end
