# frozen_string_literal: true

require "rails_helper"

RSpec.describe Auth::Lti::Registrar do
  let(:issuer) { "https://canvas.example.com" }
  let(:registration_token) { "reg_token_123" }
  let(:openid_configuration_url) { "#{issuer}/.well-known/openid-configuration" }

  let(:openid_config_response) do
    {
      issuer: issuer,
      authorization_endpoint: "#{issuer}/api/lti/authorize_redirect",
      token_endpoint: "#{issuer}/login/oauth2/token",
      jwks_uri: "#{issuer}/api/lti/security/jwks",
      registration_endpoint: "#{issuer}/api/lti/registrations"
    }
  end

  let(:platform_registration_response) do
    {
      client_id: "10000000000001",
      token_endpoint_auth_method: "private_key_jwt",
      grant_types: %w[implicit client_credentials],
      scope: "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly https://purl.imsglobal.org/spec/lti-ags/scope/lineitem",
      registration_access_token: "access_token_456",
      "https://purl.imsglobal.org/spec/lti-tool-configuration": {
        deployment_id: "deploy_1"
      }
    }
  end

  let(:params) do
    {
      registration_token: registration_token,
      openid_configuration: openid_configuration_url
    }
  end

  let(:registrar) { described_class.new(params) }

  before do
    stub_request(:get, openid_configuration_url)
      .to_return(status: 200, body: openid_config_response.to_json, headers: { "Content-Type" => "application/json" })

    stub_request(:post, "#{issuer}/api/lti/registrations")
      .to_return(status: 200, body: platform_registration_response.to_json, headers: { "Content-Type" => "application/json" })
  end

  describe "#configure_platform!" do
    it "creates an LtiRegistration" do
      expect { registrar.configure_platform! }.to change(LtiRegistration, :count).by(1)
    end

    it "creates an LtiDeployment" do
      expect { registrar.configure_platform! }.to change(LtiDeployment, :count).by(1)
    end

    it "persists the correct registration attributes" do
      registrar.configure_platform!
      registration = LtiRegistration.last

      expect(registration).to have_attributes(
        issuer: issuer,
        client_id: "10000000000001",
        authorization_endpoint: "#{issuer}/api/lti/authorize_redirect",
        token_endpoint: "#{issuer}/login/oauth2/token",
        jwks_uri: "#{issuer}/api/lti/security/jwks",
        token_endpoint_auth_method: "private_key_jwt",
        grant_types: %w[implicit client_credentials],
        scopes: %w[nrps_membership_readonly ags_lineitem],
        registration_access_token: "access_token_456"
      )
    end

    it "persists the correct deployment attributes" do
      registrar.configure_platform!
      deployment = LtiDeployment.last

      expect(deployment).to have_attributes(
        deployment_id: "deploy_1",
        lti_registration_id: LtiRegistration.last.id
      )
    end

    context "when the registration is invalid" do
      let(:openid_config_response) do
        super().merge(issuer: issuer, authorization_endpoint: nil)
      end

      it "captures errors and reports failure" do
        registrar.configure_platform!
        expect(registrar).to be_failure
      end
    end
  end

  describe "#normalize_scopes" do
    it "maps known LTI scope URIs to enum values" do
      registrar.configure_platform!
      expect(LtiRegistration.last.scopes).to eq %w[nrps_membership_readonly ags_lineitem]
    end

    context "with unrecognized scopes" do
      let(:platform_registration_response) do
        {
          client_id: "10000000000001",
          token_endpoint_auth_method: "private_key_jwt",
          grant_types: %w[implicit client_credentials],
          scope: "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly https://unknown.example.com/scope",
          "https://purl.imsglobal.org/spec/lti-tool-configuration": {
            deployment_id: "deploy_1"
          }
        }
      end

      it "discards unrecognized scopes" do
        registrar.configure_platform!
        expect(LtiRegistration.last.scopes).to eq %w[nrps_membership_readonly]
      end
    end
  end
end
