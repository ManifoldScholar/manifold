# frozen_string_literal: true

class OauthController < ApplicationController
  include ActionController::RequestForgeryProtection

  include ManagesOauthCookie

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
          <div style="margin-top: 100px; text-align: center;">
            <h1>Redirecting, Please Wait</h1>
            <form id="auth_redirect_form" action="/auth/#{params[:provider]}" method="POST">
              <input type="hidden" name="authenticity_token" value="#{session["_csrf_token"]}" />
              <input type="submit" id="auth_redirect_submit" value="Click here if you're not automatically redirected" />
            </form>
          </div>
          <script type="text/javascript">
            document.getElementById("auth_redirect_submit").style.visibility = "hidden";
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
