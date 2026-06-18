module Auth
  module Lti
    class RegistrationsController < ActionController::Base
      include RendersInIframe

      layout "auth"

      skip_before_action :verify_authenticity_token, only: :create

      after_action :set_frame_options

      def show
        @consent = ::Lti::Registration::Consent.new(request, params)

        render :show, status: @consent.valid? ? :ok : :bad_request
      end

      def create
        @registrar = ::Lti::Registration::Registrar.new(params)
        @registrar.register_platform! if @registrar.valid?

        render :create, status: @registrar.valid? ? :ok : :bad_request
      end

    end
  end
end
