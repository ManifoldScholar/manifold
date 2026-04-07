# frozen_string_literal: true

module Auth
  class OmniauthController < ActionController::Base
    include ManagesOauthCookie

    POST_AUTH_REDIRECT_PATH = "/oauth"
    AUTH_ERROR_STRING = "An error has occurred logging you in"

    layout "auth"

    def redirect; end

    def authorize
      outcome = ExternalAuth::FindUser.run(
        provider: params[:provider],
        auth_hash: omniauth_hash
      )

      if outcome.valid?
        Identities::HandleExternalAuth.new.call(outcome.identity, omniauth_hash)
        set_auth_code(outcome.user)
      end

      redirect_to post_authorize_redirect_uri(error: outcome.invalid?).to_s, allow_other_host: true
    end

    def jwks
      return head :not_found unless Rails.application.config.manifold.private_key

      render json: Auth::Jwks.new.jwks
    end

    private

    def post_authorize_redirect_uri(error: false)
      URI.parse(Rails.configuration.manifold.url).tap do |uri|
        uri.path = POST_AUTH_REDIRECT_PATH
        uri.query = error ? "error=#{AUTH_ERROR_STRING}" : redirect_resource_query_string
      end
    end

    def redirect_resource
      relay_state = params[:RelayState] || params[:relay_state]
      return {} unless relay_state.present?

      resource = ExternalIdentifier.fetch(relay_state)&.identifiable
      return {} if resource.blank?

      {
        redirect_type: resource.class.name,
        redirect_id: resource.try(:slug) || resource.id
      }
    end

    def redirect_resource_query_string
      redirect_resource.map { _1.join("=") }.join("&")
    end

    def omniauth_hash
      request.env["omniauth.auth"]
    end
  end
end
