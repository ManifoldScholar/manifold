class OauthController < ApplicationController
  include ActionView::Rendering

  skip_after_action :set_content_type

  def authorize
    outcome = ExternalAuth::FindUser.run(
      provider: params[:provider],
      auth_hash: omniauth_hash
    )

    @oauth_payload = ExternalAuth::Payload.new outcome

    render layout: false
  end

  private

  def omniauth_hash
    request.env["omniauth.auth"]
  end
end
