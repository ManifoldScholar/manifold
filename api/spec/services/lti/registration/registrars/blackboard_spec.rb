# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::Registration::Registrars::Blackboard do
  let(:issuer) { "https://blackboard.example.com" }
  let(:openid_configuration_url) { "#{issuer}/.well-known/openid-configuration" }

  let(:openid_config_response) do
    {
      issuer: issuer,
      authorization_endpoint: "#{issuer}/api/v1/gateway/oidcauth",
      token_endpoint: "#{issuer}/learn/api/public/v1/oauth2/token",
      jwks_uri: "#{issuer}/api/v1/management/applications/jwks.json",
      registration_endpoint: "#{issuer}/learn/api/v1/lti/registrations",
      "https://purl.imsglobal.org/spec/lti-platform-configuration": { product_family_code: "BlackboardLearn" }
    }
  end

  let(:params) do
    { registration_token: "reg_token_123", openid_configuration: openid_configuration_url }
  end

  before do
    stub_request(:get, openid_configuration_url)
      .to_return(status: 200, body: openid_config_response.to_json, headers: { "Content-Type" => "application/json" })
  end

  it "is selected by Registrar.build for product_family_code 'BlackboardLearn'" do
    expect(Lti::Registration::Registrar.build(params)).to be_an_instance_of(described_class)
  end
end
