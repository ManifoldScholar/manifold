# frozen_string_literal: true

module Auth
  class OmniauthController < ActionController::Base # rubocop:disable Rails/ApplicationController
    include ManagesOauthCookie
    include RendersInIframe

    AUTH_ERROR_STRING = "An error has occurred logging you in"

    layout "auth"

    skip_before_action :verify_authenticity_token, if: :lti?
    # LTI request forgery detection happens in the OmniAuth strategy
    # skip_before_action :verify_authenticity_token, only: :authorize, if: -> { lti? }

    after_action :set_frame_options

    def redirect; end

    def authorize
      outcome = ExternalAuth::FindUser.run(
        provider: params[:provider],
        auth_hash: omniauth_hash
      )

      if outcome.valid?
        @current_user = outcome.user
        Identities::HandleExternalAuth.new.call(outcome.identity, omniauth_hash)
        set_auth_code(@current_user)
      end

      return handle_deep_linking_request if @current_user && lti_deep_linking_request?

      enroll_in_reading_group if @current_user && lti?

      error = outcome.invalid? ? AUTH_ERROR_STRING : nil
      redirect = Auth::OmniauthRedirect.new(omniauth_hash, params, error:)

      redirect_to redirect.redirect_url, allow_other_host: true
    end

    def jwks
      return head :not_found unless Rails.application.config.manifold.private_key

      render json: Auth::Jwks.new.jwks
    end

    private

    # Handle an LTI Deep Linking request: cache the context and redirect the
    # instructor to the React selection page, or render the error template with
    # the status the handler categorized the failure as. Runs the handler once.
    def handle_deep_linking_request
      result = ::Lti::DeepLinking::HandleRequest.new(omniauth_hash, @current_user).call

      result.either(
        ->(context) { redirect_to deep_linking_redirect_url(context), allow_other_host: true },
        ->(failure) { render_deep_linking_error(failure) }
      )
    end

    def deep_linking_redirect_url(context)
      Auth::OmniauthRedirect.new(omniauth_hash, params, deep_linking_context: context).redirect_url
    end

    def render_deep_linking_error(failure)
      @error_message = failure[:message]
      render "auth/lti/deep_linking/error", status: failure[:status]
    end

    # JIT-enroll the launching user into the course's reading group when the
    # launched resource belongs to it. Best-effort; never blocks the launch.
    def enroll_in_reading_group
      ::Lti::ResourceLink::Enroll.new(omniauth_hash, @current_user).call
    end

    def lti_deep_linking_request?
      return false unless lti?

      omniauth_hash&.dig("extra", "lti", "message_type") == ::Lti::Registration::Registrar::DL_MESSAGE_TYPE
    end

    def omniauth_hash
      request.env["omniauth.auth"]
    end

    def lti?
      params[:provider] == "lti"
    end

    content_security_policy do |policy|
      policy.frame_ancestors :self, "https://web.canvas.orb.local"
    end
  end
end
