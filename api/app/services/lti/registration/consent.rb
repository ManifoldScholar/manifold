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

        issuer_policy.permits?(referrer)
      end

      def issuer_policy
        @issuer_policy ||= ::Lti::IssuerPolicy.new(lti_settings)
      end

      def referrer
        @referrer ||= @request.referrer
      end
    end
  end
end
