# frozen_string_literal: true

module Lti
  module Registration
    class Consent
      attr_reader :errors, :openid_configuration_url, :registration_token

      def initialize(request, params)
        @request = request
        @registration_token = params[:registration_token]
        @openid_configuration_url = params[:openid_configuration]
        @errors = Set.new
      end

      def valid?
        return false if @errors.any?

        @errors << "LTI registration is disabled" unless autoregistration_allowed?
        @errors << "Invalid or missing referer header" if referrer_host.blank?
        @errors << "LTI registration is not permitted from your domain" if registration_blocked?

        @errors.none?
      end

      def invalid?
        !valid?
      end

      def lti_settings
        @lti_settings ||= Settings.current.lti
      end

      def autoregistration_allowed?
        lti_settings.enabled? && lti_settings.autoregistration?
      end

      def registration_blocked?
        referrer_host.present? && LtiRegistration.blocked?(referrer_host)
      end

      def referrer
        @request.referrer
      end

      private

      def referrer_uri
        @referrer_uri ||= URI.parse(referrer) if referrer.present?
      rescue URI::InvalidURIError
        nil
      end

      def referrer_host
        referrer_uri&.host
      end
    end
  end
end
