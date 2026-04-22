# frozen_string_literal: true

module Auth
  module Lti
    # Handles registration of a LMS platform via the LTI 1.3 standard
    class Registrar
      include Rails.application.routes.url_helpers

      SCOPE_MAP = {
        "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly" => "nrps_membership_readonly",
        "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem" => "ags_lineitem",
        "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem.readonly" => "ags_lineitem_readonly",
        "https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly" => "ags_result_readonly",
        "https://purl.imsglobal.org/spec/lti-ags/scope/score" => "ags_score"
      }.freeze

      NRPS_READONLY_SCOPE = "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly"
      DL_MESSAGE_TYPE     = "LtiDeepLinkingRequest"

      TOOL_CONFIGURATION_KEY = "https://purl.imsglobal.org/spec/lti-tool-configuration"

      REQUIRED_OPENID_CONFIG_KEYS = %i[
        registration_endpoint
        issuer
        authorization_endpoint
        token_endpoint
        jwks_uri
      ].freeze

      attr_reader :errors, :openid_configuration_url, :referrer, :registration_token

      # Accepts params from an LTI 1.3 autoregistration flow
      # @param params [#[]] params containing keys :registration_token and :openid_configuration
      def initialize(params)
        @registration_token = params[:registration_token]
        @openid_configuration_url = params[:openid_configuration]
        @options = params[:options]
        @errors = Set.new
      end

      def register_platform!
        ensure_valid_configuration!
        return unless valid?

        platform_configuration
        return unless valid?

        persist_registration!
      end

      def success?
        errors.blank?
      end

      def failure?
        !success?
      end

      # @return [void]
      def ensure_valid_configuration!
        unless issuer_allowed?
          errors << "Autoregistration for this platform is not allowed"
          return false
        end

        errors << "Unable to fetch openid configuration" unless openid_configuration_valid?

        errors << "Invalid issuer" if openid_configuration.present? && openid_uri.host != URI.parse(openid_configuration[:issuer]).host
      end

      # @return [Boolean]
      def valid?
        errors.none?
      end

      private

      # Fetches the OIDC configuration from the LMS-provided URL
      # @return [Hash]
      def openid_configuration
        @openid_configuration ||= HTTParty.get(@openid_configuration_url).then do |response|
          handle_response!(response)
        rescue HTTParty::Foul, Socket::ResolutionError => e
          @errors << e.message
        end
      end

      # @return [String, nil]
      def registration_endpoint
        @registration_endpoint ||= openid_configuration[:registration_endpoint]
      end

      # POSTs Manifold's tool configuration to the LMS Platform and returns the memoized response JSON
      # @return [Hash]
      def platform_configuration
        @platform_configuration ||= HTTParty.post(
          registration_endpoint,
          body: platform_registration_payload.to_json,
          headers: {
            "Content-Type" => "application/json",
            "Authorization" => "Bearer #{registration_token}"
          }
        ).then do |response|
          handle_response!(response)
        rescue HTTParty::Foul, Socket::ResolutionError => e
          @errors << e.message
        end
      end

      # @return [Hash<Symbol, Any>]
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
          scope: NRPS_READONLY_SCOPE,
          logo_uri: settings.press_logo&.url,
          TOOL_CONFIGURATION_KEY => {
            domain: client_host,
            target_link_uri: client_uri.to_s,
            description: settings.general.installation_name,
            claims: %w[iss sub name given_name family_name email],
            messages: [
              {
                type: "LtiResourceLinkRequest",
                target_link_uri: client_uri.to_s,
                label: "Link to #{settings.general.installation_name}",
                placements: ["link_selection", "course_navigation"],
                icon_uri: settings.press_logo&.url
              },
              {
                type: DL_MESSAGE_TYPE,
                target_link_uri: client_uri.to_s,
                label: "Select multiple resources from #{settings.general.installation_name}",
                placements: [
                  "link_selection",
                  "editor_button",
                  "assignment_selection",
                  "course_assignments_menu",
                  "module_index_menu_modal"
                ],
                icon_uri: settings.press_logo&.url
              }
            ]
          }
        }.compact
      end

      def persist_registration!
        lti_registration
        return unless valid?

        lti_deployment if deployment_id.present?
      end

      # Finds or creates an LTI registration for the issuer and client
      # @return [LtiRegistration, nil]
      def lti_registration
        @lti_registration ||= LtiRegistration.find_or_create_by!(
          issuer: openid_configuration[:issuer],
          client_id: platform_configuration[:client_id]
        ) do |registration|
          registration.name = URI.parse(openid_configuration[:issuer]).host
          registration.authorization_endpoint = openid_configuration[:authorization_endpoint]
          registration.token_endpoint = openid_configuration[:token_endpoint]
          registration.jwks_uri = openid_configuration[:jwks_uri]
          registration.token_endpoint_auth_method = platform_configuration[:token_endpoint_auth_method]
          registration.grant_types = platform_configuration[:grant_types] || []
          registration.scopes = normalize_scopes(platform_configuration[:scope])
          registration.registration_access_token = platform_configuration[:registration_access_token]
        end
      rescue ActiveRecord::RecordInvalid => e
        @errors.concat(e.record.errors.full_messages)
      end

      # Finds or creates an LTI deployment for the registration
      # Fails silently if the registration payload does not include a deployment_id
      # @return [LtiDeployment, nil]
      def lti_deployment
        @lti_deployment ||= LtiDeployment.create!(
          lti_registration:,
          deployment_id:
        )
      end

      # @return [String, nil]
      def deployment_id
        @deployment_id ||= platform_configuration[:deployment_id]
      end

      # @return [Array<String>]
      def normalize_scopes(scope_string)
        return [] if scope_string.blank?

        scope_string.to_s.split.filter_map { |uri| SCOPE_MAP[uri] }
      end

      # Is the issuer allowed to register according to settings?
      def issuer_allowed?
        return false if openid_configuration.blank?

        allowlist = Settings.current.lti.issuer_allowlist

        allowlist.blank? || allowlist.include?(openid_configuration[:issuer])
      end

      # Does the OIDC config exist and contain all necessary keys?
      def openid_configuration_valid?
        openid_configuration.present? &&
          REQUIRED_OPENID_CONFIG_KEYS.all? { openid_configuration[_1].present? }
      end

      # @return [URI::HTTP]
      def api_uri
        URI.parse(Rails.application.config.manifold.api_url)
      end

      # @return [URI::HTTP]
      def client_uri
        URI.parse(Rails.application.config.manifold.url)
      end

      # TODO: Maybe set default_url_options
      # @return [String]
      def initiate_login_uri
        auth_redirect_url(:lti, host: api_host)
      end

      # @return [Array<String>]
      def redirect_uris
        [auth_callback_url(:lti, host: api_host)]
      end

      # @return [String]
      def jwks_uri
        auth_jwks_url(host: api_host)
      end

      # @return [URI::HTTP]
      def openid_uri
        @openid_uri ||= URI.parse(openid_configuration_url)
      end

      # @return [URI::HTTP]
      def referrer_uri
        @referrer_uri ||= URI.parse(referrer)
      end

      # The API host with port appended only if localhost
      # @return [String]
      def api_host
        return api_uri.host unless api_uri.host == "localhost"

        "#{api_uri.host}:#{api_uri.port}"
      end

      # The client host with port appended only if localhost
      # @return [String]
      def client_host
        return client_uri.host unless client_uri.host == "localhost"

        "#{client_uri.host}:#{client_uri.port}"
      end

      # @return [Settings]
      def settings
        @settings ||= Settings.current
      end

      # Handles JSON responses from the LMS platform and catches error states
      # Raises an exception if the response is invalid
      # Exception handling must occur in the calling method
      # @raise [HTTParty::Foul]
      # @param response [HTTParty::Response] the response object
      # @param error_message [String] the message to print to the user in case of error - status code will be appended
      # @return [Hash<Symbol, Any>]
      def handle_response!(response, error_message: "A registration error occurred")
        if response.success? && response.content_type.include?("json")
          response.deep_symbolize_keys
        else
          Rails.logger.error("LTI Registration error: #{r.inspect}")
          raise HTTParty::Foul, "#{error_message} (HTTP status #{response.code})"
        end
      end
    end
  end
end
