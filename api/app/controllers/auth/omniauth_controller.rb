# frozen_string_literal: true

module Auth
  class OmniauthController < ActionController::Base # rubocop:disable Rails/ApplicationController
    include ManagesOauthCookie
    include RendersInIframe

    AUTH_ERROR_STRING = "An error has occurred logging you in"

    layout "auth"

    skip_before_action :verify_authenticity_token, if: :lti?

    after_action :set_frame_options

    def redirect; end

    def authorize
      outcome = ExternalAuth::FindUser.run(provider: params[:provider], auth_hash: omniauth_hash)

      if outcome.requires_link?
        return redirect_to identity_linker.divert_url(outcome.linkable_user), allow_other_host: true
      end

      establish_current_user(outcome)

      return finalize_identity_link if @current_user && account_link_token.present?

      complete_authorization
    end

    def jwks
      return head :not_found unless Rails.application.config.manifold.private_key

      render json: Auth::Jwks.new.jwks
    end

    private

    def establish_current_user(outcome)
      return unless outcome.valid?

      @current_user = outcome.user
      Identities::HandleExternalAuth.new.call(outcome.identity, omniauth_hash) if @current_user
    end

    def complete_authorization
      return redirect_to(error_redirect_url, allow_other_host: true) unless @current_user

      set_auth_code(@current_user)

      resolver = ExternalAuth::Resolver.new(omniauth_hash, @current_user, params)
      return render_deep_linking_error(resolver.failure) if resolver.failure

      redirect_to resolver.redirect_url, allow_other_host: true
    end

    def error_redirect_url
      Auth::OmniauthRedirect.new(omniauth_hash, params, error: AUTH_ERROR_STRING).redirect_url
    end

    def finalize_identity_link
      link = identity_linker.finalize(account_link_token, @current_user)
      set_auth_code(link.user) if link.success?
      redirect_to link.redirect_url, allow_other_host: true
    end

    def identity_linker
      @identity_linker ||= Auth::IdentityLinker.new(omniauth_hash, params)
    end

    # Set only on the return OAuth login (OmniAuth carries it through as a param), never on the first
    # LTI launch.
    def account_link_token
      request.env.dig("omniauth.params", "account_link_token").presence || params[:account_link_token].presence
    end

    def render_deep_linking_error(failure)
      @error_message = failure[:message]
      render "auth/lti/deep_linking/error", status: failure[:status]
    end

    def omniauth_hash
      request.env["omniauth.auth"]
    end

    def lti?
      params[:provider] == "lti"
    end

    content_security_policy do |policy|
      policy.frame_ancestors :self, omniauth_hash.extra.raw_info.iss if lti? && omniauth_hash.present?
    end
  end
end
