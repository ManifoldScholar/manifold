# frozen_string_literal: true

module Auth
  class OmniauthController < ActionController::Base
    include ManagesOauthCookie
    include RendersInIframe

    POST_AUTH_REDIRECT_PATH = "/oauth"
    PICKER_REDIRECT_PATH    = "/lti/picker"
    PICKER_TOKEN_PARAM      = "lti_context"
    AUTH_ERROR_STRING       = "An error has occurred logging you in"

    layout "auth"

    skip_before_action :verify_authenticity_token, if: :lti?
    # LTI request forgery detection happens in the OmniAuth strategy
    # skip_before_action :verify_authenticity_token, only: :authorize, if: -> { lti? }

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

      return handle_deep_linking_request(outcome.user) if outcome.valid? && lti? && deep_linking_request?

      redirect_to post_authorize_redirect_uri(error: outcome.invalid?).to_s, allow_other_host: true
    end

    def jwks
      return head :not_found unless Rails.application.config.manifold.private_key

      render json: Auth::Jwks.new.jwks
    end

    private

    def handle_deep_linking_request(user)
      result = Auth::Lti::DeepLinkingHandler.new(omniauth_hash, user).call

      if result.ok
        redirect_to picker_redirect_uri(result.token).to_s, allow_other_host: true
      else
        @error_message = result.message
        status = result.log_level == :error ? :internal_server_error : :bad_request
        render "auth/lti/deep_linking/error", layout: "auth", status: status
      end
    end

    def picker_redirect_uri(token)
      URI.parse(Rails.configuration.manifold.url).tap do |uri|
        uri.path  = PICKER_REDIRECT_PATH
        uri.query = "#{PICKER_TOKEN_PARAM}=#{token}"
      end
    end

    def deep_linking_request?
      omniauth_hash&.dig("extra", "lti", "message_type") == Auth::Lti::Registrar::DL_MESSAGE_TYPE
    end

    def post_authorize_redirect_uri(error: false)
      URI.parse(Rails.configuration.manifold.url).tap do |uri|
        uri.path = POST_AUTH_REDIRECT_PATH
        uri.query = error ? "error=#{AUTH_ERROR_STRING}" : post_authorize_query_string
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
      url_string = if lti?
        omniauth_hash&.dig("extra", "target_link_uri")
      elsif params[:RelayState] || params[:relay_state]
        relay_state = params[:RelayState] || params[:relay_state]
        relay_state if URI.regexp.match? relay_state
      end

      return unless url_string

      uri = URI.parse(url_string)
      return unless uri.host == Rails.application.config.manifold.domain.gsub(/:\d+/, "")

      { redirect_path: "#{uri.path}?#{uri.query}".delete_suffix("?") }
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

    def lti?
      params[:provider] == "lti"
    end
  end
end
