# frozen_string_literal: true

require "rails_helper"

# The LTI login is initiated by the LMS inside an iframe, so it arrives with no
# Rails CSRF token and no usable session cookie. OmniAuth's request-phase
# authenticity check must be skipped for the lti provider (the launch is instead
# protected by the signed state parameter); other providers keep it.
RSpec.describe "LTI OIDC login initiation", type: :request do
  let(:registration) { FactoryBot.create(:lti_registration) }

  before do
    OmniAuth.config.test_mode = false
    allow(Settings).to receive_message_chain(:current, :lti, :enabled?).and_return(true)
  end

  it "starts the OIDC flow without a session CSRF token" do
    post "/auth/lti", params: {
      iss: registration.issuer,
      client_id: registration.client_id,
      login_hint: "user-123",
      target_link_uri: "#{Rails.application.config.manifold.url}/lti/launch"
    }

    expect(response).to have_http_status(:found)
    expect(response.location).to start_with(registration.authorization_endpoint)
  end
end
