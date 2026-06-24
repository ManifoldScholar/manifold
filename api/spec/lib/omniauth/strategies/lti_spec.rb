# frozen_string_literal: true

require "rails_helper"

RSpec.describe OmniAuth::Strategies::Lti do
  let(:registration) { FactoryBot.create(:lti_registration, issuer: "https://canvas.example.com", client_id: "tool-client-id") }
  let(:deployment)   { FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "deploy-1") }

  let(:jwks_kid)        { "kid-test" }
  let!(:keypair)        { build_jwks(kid: jwks_kid) }
  let(:rsa_key)         { keypair[0] }
  let(:jwks_payload)    { keypair[2] }

  let(:nonce) { "nonce-#{SecureRandom.hex(8)}" }
  let(:state) { { "nonce" => nonce, "target_link_uri" => "https://manifold.test/" } }

  let(:base_claims) do
    {
      "iss" => registration.issuer,
      "aud" => registration.client_id,
      "sub" => "user-1",
      "iat" => Time.now.to_i,
      "exp" => Time.now.to_i + 300,
      "nonce" => nonce,
      "https://purl.imsglobal.org/spec/lti/claim/deployment_id" => deployment.deployment_id,
      "https://purl.imsglobal.org/spec/lti/claim/message_type"  => "LtiResourceLinkRequest",
      "https://purl.imsglobal.org/spec/lti/claim/version"       => "1.3.0"
    }
  end

  def signed_id_token(claims)
    JWT.encode(claims, rsa_key, "RS256", { kid: jwks_kid })
  end

  def strategy
    @strategy ||= described_class.new(->(_env) { [200, {}, ["OK"]] })
  end

  before do
    Rails.cache.clear
    # Force the deployment to be created before the strategy runs.
    deployment
    stub_request(:get, registration.jwks_uri)
      .to_return(status: 200, body: jwks_payload.to_json, headers: { "Content-Type" => "application/json" })
    allow(Settings).to receive_message_chain(:current, :lti, :enabled?).and_return(true)
  end

  describe "#decode_and_verify! with a valid LtiResourceLinkRequest" do
    it "returns the decoded claims hash without raising" do
      id_token = signed_id_token(base_claims)
      claims = strategy.send(:decode_and_verify!, id_token, state)
      expect(claims["iss"]).to eq(registration.issuer)
      expect(claims["https://purl.imsglobal.org/spec/lti/claim/message_type"]).to eq("LtiResourceLinkRequest")
    end
  end

  describe "#decode_and_verify! with a valid LtiDeepLinkingRequest" do
    let(:dl_claims) do
      base_claims.merge(
        "https://purl.imsglobal.org/spec/lti/claim/message_type" => "LtiDeepLinkingRequest",
        "https://purl.imsglobal.org/spec/lti/claim/deep_linking_settings" => {
          "deep_link_return_url" => "https://canvas.example.com/dl_return",
          "accept_types"         => ["ltiResourceLink"],
          "accept_multiple"      => true,
          "data"                 => "opaque-platform-data"
        }
      )
    end

    it "returns the decoded claims hash including deep_linking_settings without raising" do
      id_token = signed_id_token(dl_claims)
      claims = strategy.send(:decode_and_verify!, id_token, state)
      expect(claims["https://purl.imsglobal.org/spec/lti/claim/message_type"]).to eq("LtiDeepLinkingRequest")
      expect(claims["https://purl.imsglobal.org/spec/lti/claim/deep_linking_settings"]).to include(
        "deep_link_return_url" => "https://canvas.example.com/dl_return",
        "accept_types"         => ["ltiResourceLink"],
        "accept_multiple"      => true,
        "data"                 => "opaque-platform-data"
      )
    end
  end

  describe "#verify_deployment!" do
    it "accepts and returns a registered, enabled deployment" do
      expect(strategy.send(:verify_deployment!, registration, base_claims)).to eq(deployment)
    end

    it "raises OmniAuth::Error when the deployment_id claim is missing" do
      claims_without_deployment = base_claims.except("https://purl.imsglobal.org/spec/lti/claim/deployment_id")
      expect do
        strategy.send(:verify_deployment!, registration, claims_without_deployment)
      end.to raise_error(OmniAuth::Error, /Missing deployment_id claim/)
    end

    it "auto-creates an unrecorded deployment under the verified registration" do
      claims = base_claims.merge("https://purl.imsglobal.org/spec/lti/claim/deployment_id" => "deploy-new")
      expect do
        strategy.send(:verify_deployment!, registration, claims)
      end.to change { registration.lti_deployments.where(deployment_id: "deploy-new").count }.from(0).to(1)
    end

    it "raises OmniAuth::Error when the deployment is disabled" do
      deployment.update!(enabled: false)
      expect do
        strategy.send(:verify_deployment!, registration, base_claims)
      end.to raise_error(OmniAuth::Error, /is disabled/)
    end
  end
end
