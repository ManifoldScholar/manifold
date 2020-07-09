class OauthController < ApplicationController

  skip_after_action :set_content_type

  def authorize
    outcome = ExternalAuth::FindUser.run(
      provider: params[:provider],
      auth_hash: omniauth_hash
    )

    @oauth_payload = ExternalAuth::Payload.new outcome
    render html: body.html_safe, layout: false
  end

  private

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
