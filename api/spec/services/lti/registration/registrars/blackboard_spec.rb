# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::Registration::Registrars::Blackboard do
  include_context "lti openid configuration"

  let(:issuer) { "https://blackboard.example.com" }

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

  it "is selected by Registrar.build for product_family_code 'BlackboardLearn'" do
    expect(Lti::Registration::Registrar.build(params)).to be_an_instance_of(described_class)
  end
end
