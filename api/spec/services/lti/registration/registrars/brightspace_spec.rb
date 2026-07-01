# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::Registration::Registrars::Brightspace do
  let(:issuer) { "https://brightspace.example.com" }
  let(:openid_configuration_url) { "#{issuer}/.well-known/openid-configuration" }

  let(:openid_config_response) do
    {
      issuer: issuer,
      authorization_endpoint: "#{issuer}/d2l/lti/authenticate",
      token_endpoint: "#{issuer}/core/connect/token",
      jwks_uri: "#{issuer}/d2l/.well-known/jwks",
      registration_endpoint: "#{issuer}/d2l/api/lti/registration",
      "https://purl.imsglobal.org/spec/lti-platform-configuration": { product_family_code: "desire2learn" }
    }
  end

  let(:platform_registration_response) do
    {
      client_id: "client-abc",
      token_endpoint_auth_method: "private_key_jwt",
      grant_types: %w[implicit client_credentials],
      "https://purl.imsglobal.org/spec/lti-tool-configuration": {}
    }
  end

  let(:params) do
    { registration_token: "reg_token_123", openid_configuration: openid_configuration_url }
  end

  let(:registrar) { described_class.new(params) }

  before do
    stub_request(:get, openid_configuration_url)
      .to_return(status: 200, body: openid_config_response.to_json, headers: { "Content-Type" => "application/json" })
    stub_request(:post, "#{issuer}/d2l/api/lti/registration")
      .to_return(status: 200, body: platform_registration_response.to_json, headers: { "Content-Type" => "application/json" })
  end

  def posted_messages
    body = nil
    expect(WebMock).to have_requested(:post, "#{issuer}/d2l/api/lti/registration").with { |req|
      body = JSON.parse(req.body)
      true
    }
    body.dig("https://purl.imsglobal.org/spec/lti-tool-configuration", "messages")
  end

  describe "#platform_registration_payload" do
    before { registrar.register_platform! }

    it "registers with core LTI: both message types, no placements or vendor extensions" do
      types = posted_messages.pluck("type")
      expect(types).to include("LtiResourceLinkRequest", "LtiDeepLinkingRequest")

      expect(posted_messages).to all(satisfy { |m| !m.key?("placements") })
      expect(posted_messages).to all(satisfy { |m| m.keys.none? { |k| k.start_with?("https://") } })
    end
  end

  describe "Registrar.build" do
    it "selects the Brightspace registrar when product_family_code is 'desire2learn'" do
      expect(Lti::Registration::Registrar.build(params)).to be_an_instance_of(described_class)
    end
  end
end
