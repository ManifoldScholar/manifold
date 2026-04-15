
module Auth
  module Lti
    class Consent

      attr_reader :errors, :openid_configuration_url, :registration_token, :referrer

      def initialize(request, params)
        @request = request
        @registration_token = params[:registration_token]
        @openid_configuration_url = params[:openid_configuration]
        @errors = Set.new
      end

      def valid?
        return false if @errors.any?

        @errors << "LTI registration is disabled or blocked for this domain" unless autoregistration_allowed?

        @errors.none?
      end

      def invalid?
        !valid?
      end

      def lti_settings
        @lti_settings ||= Settings.current.lti
      end

      def autoregistration_allowed?
        return false unless lti_settings.enabled? && lti_settings.autoregistration?
        return true if lti_settings.issuer_allowlist.blank?

        lti_settings.issuer_allowlist.include?(referrer_uri.host)
      end

      def referrer_uri
        @referrer_uri ||= URI.parse(referrer)
      end

      def referrer
        @referrer ||= @request.referrer
      end

    end
  end
end
