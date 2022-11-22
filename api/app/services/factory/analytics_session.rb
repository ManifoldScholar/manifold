require "google/apis/analytics_v3"
require "signet"

module Factory
  # Returns an analytics session object; used by the statistics model
  class AnalyticsSession

    def create_analytics_session
      return nil unless settings_valid?

      client = Google::Apis::AnalyticsV3::AnalyticsService.new
      client.authorization = Signet::OAuth2::Client
        .new(auth_options)
        .tap(&:fetch_access_token!)
      client
    rescue OpenSSL::PKey::RSAError => e
      Rails.logger.error("Google Analytics Key error: #{e}")
      nil
    rescue Signet::AuthorizationError => e
      Rails.logger.error("Google Analytics Signet Authorization Error: #{e}")
      nil
    end

    private

    def settings_valid?
      c = Rails.configuration.manifold.google
      settings = Settings.instance
      return false if c.token_uri.blank?
      return false if c.analytics_oauth_scope.blank?
      return false if settings.integrations.dig(:google_client_email).blank?
      return false if settings.secrets.dig(:google_private_key).blank?

      true
    end

    def auth_options
      settings = Settings.instance
      {
        token_credential_uri: Rails.configuration.manifold.google.token_uri,
        audience: Rails.configuration.manifold.google.token_uri,
        scope: Rails.configuration.manifold.google.analytics_oauth_scope,
        issuer: settings.integrations.dig(:google_client_email),
        signing_key: OpenSSL::PKey::RSA.new(
          settings.secrets.dig(:google_private_key)
        )
      }
    end
  end
end
