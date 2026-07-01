# frozen_string_literal: true

module Lti
  module Registration
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

      TOOL_CONFIGURATION_KEY     = "https://purl.imsglobal.org/spec/lti-tool-configuration"
      PLATFORM_CONFIGURATION_KEY = "https://purl.imsglobal.org/spec/lti-platform-configuration"

      REGISTRARS_ROOT = Rails.root.join("app/services/lti/registration/registrars")

      REQUIRED_OPENID_CONFIG_KEYS = %i[
        registration_endpoint
        issuer
        authorization_endpoint
        token_endpoint
        jwks_uri
      ].freeze

      attr_reader :errors, :openid_configuration_url, :referrer, :registration_token

      # Maps a platform's product_family_code to the vendor registrar that handles
      # it, discovered from the {Registrars} subclasses by their PRODUCT_FAMILY_CODE.
      # A platform whose code matches no subclass registers with LTI-core attributes
      # only (this base). Supporting a new LMS is therefore just adding one subclass.
      # @return [Hash{String=>Class}]
      def self.vendor_registrars
        load_vendor_registrars!

        descendants.select { |klass| klass.const_defined?(:PRODUCT_FAMILY_CODE, false) }
                   .index_by { |klass| klass::PRODUCT_FAMILY_CODE }
      end

      # Zeitwerk enumerates only already-loaded constants, so ensure the registrar
      # files are loaded before reading descendants. Production eager-loads them.
      # @return [void]
      def self.load_vendor_registrars!
        return if Rails.application.config.eager_load

        Rails.autoloaders.main.eager_load_dir(REGISTRARS_ROOT)
      end

      # Builds the registrar best suited to the registering platform, detected via
      # the OIDC platform configuration's product_family_code. Falls back to this
      # base (LTI-core only) for unknown platforms. The probe's fetched OIDC config
      # is handed to the vendor registrar so discovery is not requested twice.
      # @param params [#[]]
      # @return [Registrar]
      def self.build(params)
        probe = new(params)
        vendor = vendor_registrars[probe.product_family_code]
        return probe unless vendor

        vendor.new(params, openid_configuration: probe.openid_configuration)
      end

      # Accepts params from an LTI 1.3 autoregistration flow
      # @param params [#[]] params containing keys :registration_token and :openid_configuration
      # @param openid_configuration [Hash, nil] a pre-fetched OIDC config to reuse
      def initialize(params, openid_configuration: nil)
        @registration_token = params[:registration_token]
        @openid_configuration_url = params[:openid_configuration]
        @options = params[:options]
        @errors = Set.new
        @openid_configuration = openid_configuration
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

      # Fetches (and memoizes) the OIDC configuration from the LMS-provided URL.
      # @return [Hash]
      def openid_configuration
        @openid_configuration ||= HTTParty.get(@openid_configuration_url).then do |response|
          handle_response!(response)
        rescue HTTParty::Foul, Socket::ResolutionError => e
          @errors << e.message
        end
      end

      # The platform's product family code from its OIDC platform configuration,
      # e.g. "canvas". Drives vendor registrar selection in {.build}.
      # @return [String, nil]
      def product_family_code
        return nil unless openid_configuration.is_a?(Hash)

        openid_configuration.dig(PLATFORM_CONFIGURATION_KEY.to_sym, :product_family_code)
      end

      private

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
          TOOL_CONFIGURATION_KEY => tool_configuration
        }.compact
      end

      # The LTI tool configuration claim. Core fields only; vendor specifics are
      # injected per message via {#message_placements} and {#message_extensions}.
      # @return [Hash]
      def tool_configuration
        {
          domain: client_host,
          target_link_uri: client_uri.to_s,
          description: settings.general.installation_name,
          claims: %w[iss sub name given_name family_name email],
          messages: tool_messages
        }
      end

      # @return [Array<Hash>]
      def tool_messages
        [
          build_message(type: "LtiResourceLinkRequest", label: "Link to #{settings.general.installation_name}"),
          build_message(type: DL_MESSAGE_TYPE, label: "Select multiple resources from #{settings.general.installation_name}")
        ]
      end

      # Builds a single tool-configuration message from core fields, then merges any
      # vendor-specific placements and extensions a subclass provides.
      # @return [Hash]
      def build_message(type:, label:)
        {
          type: type,
          target_link_uri: client_uri.to_s,
          label: label,
          icon_uri: settings.press_logo&.url
        }.merge(message_placements(type)).merge(message_extensions(type)).compact
      end

      # Vendor-specific placements for a message type. Base offers none, as
      # placement vocabularies are platform-defined.
      # @param _type [String]
      # @return [Hash]
      def message_placements(_type)
        {}
      end

      # Vendor-specific message extensions for a message type. Base offers none.
      # @param _type [String]
      # @return [Hash]
      def message_extensions(_type)
        {}
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
          REQUIRED_OPENID_CONFIG_KEYS.all? { openid_configuration[it].present? }
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
