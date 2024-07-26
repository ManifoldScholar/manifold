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

  # OVERRIDE: Alter hash structure to include info returned by CAS that is required to create a new User
  # @see app/services/external_auth/upsert_user.rb
  # @see app/services/external_auth/provisioners/user.rb
  def omniauth_hash
    return request.env["omniauth.auth"] unless params[:provider] == "cas"

    omniauth_hash = request.env["omniauth.auth"]
    omniauth_hash.info.merge!(
      email: omniauth_hash.extra.pustatus == "guest" ? omniauth_hash.extra.uid : omniauth_hash.extra.mail,
      name: omniauth_hash.extra.displayname.presence || omniauth_hash.extra.pudisplayname
    )
    omniauth_hash
  end
end
