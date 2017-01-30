require "google/apis/analytics_v3"
require "signet"

module Factory
  # Returns an analytics session object; used by the statistics model
  class AnalyticsSession

    # rubocop:disable LineLength
    def create_analytics_session
      client = Google::Apis::AnalyticsV3::AnalyticsService.new

      client.authorization = Signet::OAuth2::Client.new(
        token_credential_uri:  "https://accounts.google.com/o/oauth2/token",
        audience:              "https://accounts.google.com/o/oauth2/token",
        scope:                 "https://www.googleapis.com/auth/analytics.readonly",
        issuer:                ENV["GOOGLE_SERVICE_CLIENT_EMAIL"],
        signing_key:           OpenSSL::PKey::RSA.new(ENV["GOOGLE_SERVICE_PRIVATE_KEY"])
      ).tap(&:fetch_access_token!)
      client
    rescue Signet::AuthorizationError => e
      Rails.logger.error("Signet Authorization Error: #{e}")
      nil
    end
  end
end
