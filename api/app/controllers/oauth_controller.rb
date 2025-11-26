# frozen_string_literal: true

class OauthController < ApplicationController
  include ActionController::RequestForgeryProtection

  skip_after_action :set_content_type

  before_action :generate_csrf_token, only: :redirect

  def redirect
    render html: redirect_body.html_safe, layout: false
  end

  def authorize
    outcome = ExternalAuth::FindUser.run(
      provider: params[:provider],
      auth_hash: omniauth_hash
    )

    Identities::HandleExternalAuth.new.call(outcome.identity, omniauth_hash) if outcome.valid?

    @oauth_payload = ExternalAuth::Payload.new outcome
    render html: body.html_safe, layout: false
  end

  private

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

  def body
    <<~HEREDOC
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication successful!</title>
          <style></style>
        </head>
        <body>
          <h1>Authorization success!</h1>
          <script type="text/javascript">
            window.opener.postMessage(#{@oauth_payload.to_json}, "*");
            window.close();
          </script>
        </body>
      </html>
    HEREDOC
  end

  def omniauth_hash
    request.env["omniauth.auth"]
  end
end
