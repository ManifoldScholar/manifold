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

      expect(LtiRegistration.last).to have_attributes(
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

      expect(LtiDeployment.last).to have_attributes(
        deployment_id: "deploy_1",
        lti_registration_id: LtiRegistration.last.id
      )
    end

    context "when the registration is invalid" do
      let(:openid_config_response) do
        {
          issuer: issuer,
          authorization_endpoint: nil,
          token_endpoint: "#{issuer}/login/oauth2/token",
          jwks_uri: "#{issuer}/api/lti/security/jwks",
          registration_endpoint: "#{issuer}/api/lti/registrations"
        }
      end

      it "captures errors and reports failure" do
        registrar.configure_platform!
        expect(registrar).to be_failure
      end
    end

    context "when a registration already exists for the issuer and client_id" do
      let!(:existing_registration) do
        FactoryBot.create(:lti_registration,
          issuer: issuer,
          client_id: "10000000000001",
          name: "Custom Name",
          authorization_endpoint: "#{issuer}/old/authorize"
        )
      end

      it "does not create a new registration" do
        expect { registrar.configure_platform! }.not_to change(LtiRegistration, :count)
      end

      it "updates the mutable registration fields" do
        registrar.configure_platform!
        existing_registration.reload

        expect(existing_registration.authorization_endpoint).to eq "#{issuer}/api/lti/authorize_redirect"
      end

      it "preserves the existing name" do
        registrar.configure_platform!
        existing_registration.reload

        expect(existing_registration.name).to eq "Custom Name"
      end

      it "creates a new deployment" do
        expect { registrar.configure_platform! }.to change(LtiDeployment, :count).by(1)
      end

      context "when the deployment already exists" do
        let!(:existing_deployment) do
          FactoryBot.create(:lti_deployment, lti_registration: existing_registration, deployment_id: "deploy_1")
        end

        it "does not create a duplicate deployment" do
          expect { registrar.configure_platform! }.not_to change(LtiDeployment, :count)
        end
      end
    end
  end

  describe "#valid?" do
    context "when the issuer allowlist is defined" do
      before do
        Settings.instance.update!(lti: { enabled: true, autoregistration: true, issuer_allowlist: [issuer] })
      end

      it "allows an issuer in the allowlist" do
        expect(registrar).to be_valid
      end
    end

    context "when the issuer is not in the allowlist" do
      before do
        Settings.instance.update!(lti: { enabled: true, autoregistration: true, issuer_allowlist: ["https://other.example.com"] })
      end

      it "rejects the issuer" do
        expect(registrar).not_to be_valid
        expect(registrar.errors).to include("autoregistration for this platform is not allowed")
      end
    end

    context "when the allowlist is empty" do
      before do
        Settings.instance.update!(lti: { enabled: true, autoregistration: true, issuer_allowlist: [] })
      end

      it "allows any issuer" do
        expect(registrar).to be_valid
      end
    end
  end

  describe "scope normalization" do
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
