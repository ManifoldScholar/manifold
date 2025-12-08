# frozen_string_literal: true

class OauthController < ApplicationController
  include ActionController::RequestForgeryProtection

  POST_AUTH_REDIRECT_PATH = "/oauth"
  AUTH_ERROR_STRING = "An error has occurred logging you in"

  skip_after_action :set_content_type

  # In order to prevent CSRF,
  def redirect
    # Sets the CSRF token in session, which sets the cookie in the response
    real_csrf_token(session)
    render html: redirect_body.html_safe, layout: false
  end

  def authorize
    outcome = ExternalAuth::FindUser.run(
      provider: params[:provider],
      auth_hash: omniauth_hash
    )

    if outcome.valid?
      Identities::HandleExternalAuth.new.call(outcome.identity, omniauth_hash)
      set_auth_code(outcome.user)
    end

    redirect_to post_authorize_redirect_uri(error: outcome.invalid?).to_s
  end

  private

  def set_auth_code(user)
    code = SecureRandom.hex
    session[:auth_code] = code
    Rails.cache.write(code, user.id)
  end

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

  def redirect_body
    <<~HEREDOC
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting</title>
          <style></style>
        </head>
        <body>
          <h1>Redirecting</h1>
          <form id="auth_redirect_form" action="/auth/#{params[:provider]}" method="POST">
            <input type="hidden" name="authenticity_token" value="#{session["_csrf_token"]}" />
          </form>
          <script type="text/javascript">
            document.getElementById("auth_redirect_form").submit();
          </script>
        </body>
      </html>
    HEREDOC
  end

  def omniauth_hash
    request.env["omniauth.auth"]
  end
end
