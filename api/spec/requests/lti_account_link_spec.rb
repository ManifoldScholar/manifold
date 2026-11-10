# frozen_string_literal: true

require "rails_helper"

RSpec.describe "LTI account-link confirmation", type: :request do
  include_context "omniauth request"

  let!(:registration) do
    FactoryBot.create(:lti_registration, issuer: "https://canvas.example.com", client_id: "tool-client-id")
  end
  let!(:deployment) { FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "deploy-1") }
  let(:user) { FactoryBot.create(:user) }

  def lti_auth_hash(uid:, email:)
    OmniAuth::AuthHash.new(
      "provider" => "lti",
      "uid" => uid,
      "info" => { "email" => email },
      "extra" => {
        "raw_info" => {
          "iss" => registration.issuer, "aud" => registration.client_id,
          "sub" => uid.split("|").last, "email" => email
        },
        "lti" => {
          "message_type" => "LtiResourceLinkRequest",
          "deployment_id" => deployment.deployment_id,
          "context" => { "id" => "ctx-1" },
          "roles" => []
        },
        "target_link_uri" => "#{Rails.configuration.manifold.url}/lti/launch?redirect_type=Project&redirect_id=#{project_id}"
      }
    )
  end

  let(:project_id) { SecureRandom.uuid }

  def mock_launch(hash)
    OmniAuth.config.mock_auth[:lti] = hash
    Rails.application.env_config["omniauth.auth"] = hash
  end

  before { Rails.cache.clear }

  after do
    OmniAuth.config.mock_auth[:lti] = nil
    Rails.application.env_config["omniauth.auth"] = nil
  end

  def link_params
    Rack::Utils.parse_nested_query(URI.parse(response.location).query)
  end

  context "when the launch email matches an existing account (new subject)" do
    before { mock_launch(lti_auth_hash(uid: "#{registration.issuer}|new-sub", email: user.email)) }

    it "diverts to the client login in link mode without linking or logging in" do
      expect { post "/auth/lti/callback" }.not_to change(Identity, :count)

      expect(response).to have_http_status(:redirect)
      expect(URI.parse(response.location).path).to eq("/login")
      expect(link_params).to include("account_link" => user.email)
      expect(link_params["account_link_token"]).to match(/\A[0-9a-f]{64}\z/)
      expect(ExternalAuth::PendingIdentityLink.find(link_params["account_link_token"])).to be_owned_by(user)
    end
  end

  context "when the subject shares an issuer with an existing identity but the sub is new" do
    let!(:existing) do
      FactoryBot.create(:identity, user: user, provider: "lti", uid: "#{registration.issuer}|old-sub")
    end

    before { mock_launch(lti_auth_hash(uid: "#{registration.issuer}|new-sub", email: user.email)) }

    it "still diverts to proof — no issuer shortcut" do
      post "/auth/lti/callback"

      expect(URI.parse(response.location).path).to eq("/login")
      expect(link_params).to include("account_link" => user.email)
    end
  end

  context "when the launch email matches no account" do
    before { mock_launch(lti_auth_hash(uid: "#{registration.issuer}|new-sub", email: "brand-new-#{SecureRandom.uuid}@example.com")) }

    it "does not divert to link confirmation" do
      post "/auth/lti/callback"

      expect(response).to have_http_status(:redirect)
      expect(URI.parse(response.location).path).not_to eq("/login")
      expect(link_params).not_to include("account_link")
    end
  end

  describe "password proof finalizes the parked link" do
    let(:token) do
      ExternalAuth::PendingIdentityLink.build(
        lti_auth_hash(uid: "#{registration.issuer}|new-sub", email: user.email), user
      ).persist!
    end

    it "attaches the identity and returns a token with the redirect params" do
      expect do
        post "/api/v1/tokens", params: { email: user.email, password: "bananarambo", account_link_token: token }
      end.to change { user.identities.where(provider: "lti").count }.by(1)

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.dig("meta", "authToken")).to be_present
      redirect = Rack::Utils.parse_nested_query(response.parsed_body.dig("meta", "redirect"))
      expect(redirect).to include("redirect_type" => "Project", "redirect_id" => project_id)
    end

    it "rejects a mismatched account and links nothing" do
      other = FactoryBot.create(:user)

      expect do
        post "/api/v1/tokens", params: { email: other.email, password: "bananarambo", account_link_token: token }
      end.not_to change(Identity, :count)

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
