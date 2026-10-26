# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::Registration::Registrars::Moodle do
  include_context "lti openid configuration"

  let(:issuer) { "https://moodle.example.com" }

  let(:openid_config_response) do
    {
      issuer: issuer,
      authorization_endpoint: "#{issuer}/mod/lti/auth.php",
      token_endpoint: "#{issuer}/mod/lti/token.php",
      jwks_uri: "#{issuer}/mod/lti/certs.php",
      registration_endpoint: "#{issuer}/mod/lti/registration.php",
      "https://purl.imsglobal.org/spec/lti-platform-configuration": { product_family_code: "moodle" }
    }
  end

  it "is selected by Registrar.build for product_family_code 'moodle'" do
    expect(Lti::Registration::Registrar.build(params)).to be_an_instance_of(described_class)
  end
end
