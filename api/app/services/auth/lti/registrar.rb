
module Auth
  module Lti
    class Registrar
      include Rails.application.routes.url_helpers

      SCOPE_MAP = {
        "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly" => "nrps_membership_readonly",
        "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem" => "ags_lineitem",
        "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem.readonly" => "ags_lineitem_readonly",
        "https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly" => "ags_result_readonly",
        "https://purl.imsglobal.org/spec/lti-ags/scope/score" => "ags_score"
      }.freeze

      attr_reader :errors, :openid_configuration_url, :referrer, :registration_token

      def initialize(params)
        @registration_token = params[:registration_token]
        @openid_configuration_url = params[:openid_configuration]
        @options = params[:options]
        @errors = []
      end

      def register_platform!
        return unless valid?

        configure_platform!
      end

      def success?
        errors.blank?
      end

      def failure?
        !success?
      end

      def valid?
        # errors << "invalid host" if openid_uri.host != referrer_uri.host
        errors << "invalid issuer" if openid_uri.host != URI.parse(openid_configuration[:issuer]).host
        errors << "unable to fetch openid configuration" if openid_configuration.blank?

        errors.none?
      end

      def configure_platform!
        persist_registration!
      end

      def lti_tool_configuration
        platform_configuration[:"https://purl.imsglobal.org/spec/lti-tool-configuration"] || {}
      end

      def openid_configuration
        @openid_configuration ||= HTTParty.get(@openid_configuration_url).deep_symbolize_keys
      end

      def registration_endpoint
        @registration_endpoint ||= openid_configuration[:registration_endpoint]
      end

      def platform_configuration
        @platform_configuration ||= HTTParty.post(
          registration_endpoint,
          body: platform_registration_payload.to_json,
          headers: {
            "Content-Type" => "application/json",
            "Authorization" => "Bearer #{registration_token}"
          }
        ).deep_symbolize_keys
      end

      def platform_registration_payload
        {
          application_type: "web",
          response_types: ["id_token"],
          grant_types: ["implicit", "client_credentials"],
          initiate_login_uri:,
          redirect_uris:,
          client_name: settings.general.installation_name,
          token_endpoint_auth_method: "private_key_jwt",
          jwks_uri:,
          logo_uri: settings.press_logo&.url,
          "https://purl.imsglobal.org/spec/lti-tool-configuration" => {
            domain: api_uri.host,
            target_link_uri: api_uri.to_s,
            claims: %w[iss sub name given_name family_name email],
            messages: [
              {
                type: "LtiResourceLinkRequest",
                target_link_uri: api_uri.to_s,
                label: "Resource Link"
              }
            ]
          }
        }.compact
      end

      def api_uri
        URI.parse(Rails.application.config.manifold.api_url)
      end

      # TODO: Maybe set default_url_options
      def initiate_login_uri
        auth_redirect_url(:lti, host: api_uri.host)
      end

      def redirect_uris
        [auth_callback_url(:lti, host: api_uri.host)]
      end

      def jwks_uri
        auth_jwks_url(host: api_uri.host)
      end

      def render_success_html
        <<~HTML.html_safe
          <!DOCTYPE html>
          <html>
            <head>
              <title>Manifold LTI Registration</title>
              <style></style>
            </head>
            <body>
              <div style="margin-top: 100px; text-align: center;">
                <h1>Registration Complete</h1>
                <button onclick="(window.opener || window.parent).postMessage({subject:'org.imsglobal.lti.close'}, '*')">Click here to continue</button>
              </div>
              <script type="text/javascript">
                function close() {
                  (window.opener || window.parent).postMessage({subject:'org.imsglobal.lti.close'}, '*');
                }
              </script>
            </body>
          </html>
        HTML
      end

      def openid_uri
        @openid_uri ||= URI.parse(openid_configuration_url)
      end

      def referrer_uri
        @referrer_uri ||= URI.parse(referrer)
      end

      def settings
        @settings ||= Settings.instance
      end

      private

      def persist_registration!
        registration = LtiRegistration.create!(
          name: URI.parse(openid_configuration[:issuer]).host,
          issuer: openid_configuration[:issuer],
          client_id: platform_configuration[:client_id],
          authorization_endpoint: openid_configuration[:authorization_endpoint],
          token_endpoint: openid_configuration[:token_endpoint],
          jwks_uri: openid_configuration[:jwks_uri],
          token_endpoint_auth_method: platform_configuration[:token_endpoint_auth_method],
          grant_types: platform_configuration[:grant_types] || [],
          scopes: normalize_scopes(platform_configuration[:scope]),
          registration_access_token: platform_configuration[:registration_access_token]
        )

        registration.lti_deployments.create!(
          deployment_id: lti_tool_configuration[:deployment_id]
        )
      rescue ActiveRecord::RecordInvalid => e
        @errors.concat(e.record.errors.full_messages)
      end

      def normalize_scopes(scope_string)
        return [] if scope_string.blank?

        scope_string.to_s.split.filter_map { |uri| SCOPE_MAP[uri] }
      end

    end
  end
end
