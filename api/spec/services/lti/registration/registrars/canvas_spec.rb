# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::Registration::Registrars::Canvas do
  let(:issuer) { "https://canvas.example.com" }
  let(:openid_configuration_url) { "#{issuer}/.well-known/openid-configuration" }

  let(:openid_config_response) do
    {
      issuer: issuer,
      authorization_endpoint: "#{issuer}/api/lti/authorize_redirect",
      token_endpoint: "#{issuer}/login/oauth2/token",
      jwks_uri: "#{issuer}/api/lti/security/jwks",
      registration_endpoint: "#{issuer}/api/lti/registrations",
      "https://purl.imsglobal.org/spec/lti-platform-configuration": { product_family_code: "canvas" }
    }
  end

  let(:platform_registration_response) do
    {
      client_id: "10000000000001",
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
    stub_request(:post, "#{issuer}/api/lti/registrations")
      .to_return(status: 200, body: platform_registration_response.to_json, headers: { "Content-Type" => "application/json" })
  end

  def posted_messages
    body = nil
    expect(WebMock).to have_requested(:post, "#{issuer}/api/lti/registrations").with { |req|
      body = JSON.parse(req.body)
      true
    }
    body.dig("https://purl.imsglobal.org/spec/lti-tool-configuration", "messages")
  end

  describe "#platform_registration_payload" do
    before { registrar.register_platform! }

    it "injects Canvas placements on both messages" do
      placements = posted_messages.to_h { |m| [m["type"], m["placements"]] }

      expect(placements["LtiResourceLinkRequest"]).to eq(described_class::RESOURCE_LINK_PLACEMENTS)
      expect(placements["LtiDeepLinkingRequest"]).to eq(described_class::DEEP_LINKING_PLACEMENTS)
    end

    it "sizes the DL selection modal via the Canvas launch_width/height extensions" do
      dl_msg = posted_messages.find { |m| m["type"] == "LtiDeepLinkingRequest" }

      expect(dl_msg[described_class::LAUNCH_WIDTH_KEY]).to eq(described_class::DL_SELECTION_WIDTH)
      expect(dl_msg[described_class::LAUNCH_HEIGHT_KEY]).to eq(described_class::DL_SELECTION_HEIGHT)
    end
  end

  describe "Registrar.build" do
    it "selects the Canvas registrar when product_family_code is 'canvas'" do
      expect(Lti::Registration::Registrar.build(params)).to be_an_instance_of(described_class)
    end
  end
end
