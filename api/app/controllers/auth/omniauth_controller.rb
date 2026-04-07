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
        uri.query = if error
                      "error=#{AUTH_ERROR_STRING}"
                    else
                      post_authorize_query_string
                    end
      end
    end

    # Generate a query string for the client to redirect the user to the requested resource
    # LTI provides a `target_link_uri`, a full URL to the requested resource
    # SAML can provide a `RelayState`
    def post_authorize_query_string
      target = target_path || target_resource
      target&.map { _1.join("=") }.join("&")
    end

    def target_path
      url_string = if params[:provider] == "lti"
        omniauth_hash&.dig("extra", "target_link_uri")
      elsif params[:RelayState] || params[:relay_state]
        relay_state = params[:RelayState] || params[:relay_state]
        relay_state if URI.regexp.match? relay_state
      end

      return unless url_string

      uri = URI.parse(url_string)
      return unless uri.host == Rails.application.config.manifold.domain

      { redirect_path: "#{uri.path}?#{uri.query}".delete_suffix("?") }
      end
    rescue URI::BadURIError, URI::InvalidURIError
      nil
    end

    def target_resource
      relay_state = params[:RelayState] || params[:relay_state]
      return {} unless relay_state.present?

      resource = ExternalIdentifier.fetch(relay_state)&.identifiable
      return {} if resource.blank?

      {
        redirect_type: resource.class.name,
        redirect_id: resource.try(:slug) || resource.id
      }
    end

    def omniauth_hash
      request.env["omniauth.auth"]
    end
  end
end
