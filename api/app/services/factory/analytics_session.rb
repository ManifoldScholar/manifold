require "google/apis/analytics_v3"
require "signet"

module Factory
  # Returns an analytics session object; used by the statistics model
  class AnalyticsSession

    # rubocop:disable LineLength
    def create_analytics_session
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

    # rubocop:disable Metrics/AbcSize
    def auth_options
      {
        token_credential_uri:  Rails.configuration.manifold.google.token_uri,
        audience:              Rails.configuration.manifold.google.token_uri,
        scope:                 Rails.configuration.manifold.google.analytics_oauth_scope,
        issuer:                Rails.configuration.manifold.google.client_email,
        signing_key:           OpenSSL::PKey::RSA.new(
          Rails.configuration.manifold.google.service_private_key
        )
      }
    end
    # rubocop:enable Metrics/AbcSize

  end
end
