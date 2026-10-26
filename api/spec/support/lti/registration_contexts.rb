# frozen_string_literal: true

# Shared setup for the LTI dynamic-registration specs. Including groups supply the
# vendor-specific `issuer` and `openid_config_response` (and, for the registration
# flow, `platform_registration_response`); these contexts stub the OIDC discovery
# and registration HTTP exchanges and expose the posted tool-configuration messages.
RSpec.shared_context "lti openid configuration" do
  let(:openid_configuration_url) { "#{issuer}/.well-known/openid-configuration" }
  let(:params) { { registration_token: "reg_token_123", openid_configuration: openid_configuration_url } }
  let(:registrar) { described_class.new(params) }

  before do
    stub_request(:get, openid_configuration_url)
      .to_return(status: 200, body: openid_config_response.to_json, headers: { "Content-Type" => "application/json" })
  end
end

RSpec.shared_context "lti platform registration" do
  include_context "lti openid configuration"

  before do
    enable_lti_autoregistration!
    stub_request(:post, openid_config_response[:registration_endpoint])
      .to_return(status: 200, body: platform_registration_response.to_json, headers: { "Content-Type" => "application/json" })
  end

  def posted_messages
    body = nil
    expect(WebMock).to have_requested(:post, openid_config_response[:registration_endpoint]).with { |req|
      body = JSON.parse(req.body)
      true
    }
    body.dig("https://purl.imsglobal.org/spec/lti-tool-configuration", "messages")
  end
end
