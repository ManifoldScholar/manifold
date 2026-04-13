module Auth
  module Lti
    class RegistrationsController < ActionController::Base

      layout "auth"

      skip_before_action :verify_authenticity_token, only: :create

      after_action :set_frame_options

      def show
        @consent = Auth::Lti::Consent.new(request, params)

        render :show, status: @consent.valid? ? :ok : :bad_request
      end

      def create
        @registrar = Auth::Lti::Registrar.new(params)
        @registrar.register_platform! if @registrar.valid?

        render :create, status: @registrar.valid? ? :ok : :bad_request
      end

      private

      def set_frame_options
        response.headers["X-Frame-Options"] = "ALLOW-FROM #{request.referrer}"
      end

    end
  end
end
