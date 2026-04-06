module Auth
  module Lti
    class RegistrationsController < ApplicationController

      skip_after_action :set_content_type

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

      def set_frame_options
        response.headers["X-Frame-Options"] = "ALLOW-FROM #{request.referrer}"
      end

    end
  end
end
