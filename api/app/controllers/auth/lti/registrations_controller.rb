module Auth
  module Lti
    class RegistrationsController < ApplicationController

      skip_after_action :set_content_type

      before_action :require_autoregistration!
      after_action :set_frame_options

      def show
        consent = Auth::Lti::Consent.new(request, params)

        if consent.valid?
          render plain: consent.render_consent_html
        else
          render plain: consent.render_error_page, status: :bad_request
        end
      end

      def create
        registrar = Auth::Lti::Registrar.new(params)
        registrar.configure_platform! if registrar.valid?

        if registrar.success?
          render plain: registrar.render_success_html
        else
          render plain: registrar.failure_response, status: :bad_request
        end
      end

      private

      def lti_settings
        Settings.current.lti
      end

      def require_autoregistration!
        return head :forbidden unless lti_settings.enabled? && lti_settings.autoregistration?
      end

      def set_frame_options
        response.headers["X-Frame-Options"] = "ALLOW-FROM #{request.referrer}"
      end

    end
  end
end
