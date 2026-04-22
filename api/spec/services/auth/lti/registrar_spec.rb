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
      "https://purl.imsglobal.org/spec/lti-tool-configuration": {}
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

  describe "#register_platform!" do
    it "creates an LtiRegistration" do
      expect { registrar.register_platform! }.to change(LtiRegistration, :count).by(1)
    end

    it "persists the correct registration attributes" do
      registrar.register_platform!

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

    context "when the OIDC issuer host does not match the openid_configuration URL host" do
      let(:openid_config_response) do
        {
          issuer: "https://other-domain.example.com",
          authorization_endpoint: "#{issuer}/api/lti/authorize_redirect",
          token_endpoint: "#{issuer}/login/oauth2/token",
          jwks_uri: "#{issuer}/api/lti/security/jwks",
          registration_endpoint: "#{issuer}/api/lti/registrations"
        }
      end

      it "captures errors and reports failure" do
        registrar.register_platform!
        expect(registrar).to be_failure
        expect(registrar.errors).to include("Invalid issuer")
      end

      it "does not create a registration" do
        expect { registrar.register_platform! }.not_to change(LtiRegistration, :count)
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
        expect { registrar.register_platform! }.not_to change(LtiRegistration, :count)
      end

      it "preserves the existing registration fields" do
        registrar.register_platform!
        existing_registration.reload

        expect(existing_registration.authorization_endpoint).to eq "#{issuer}/old/authorize"
      end

      it "preserves the existing name" do
        registrar.register_platform!
        existing_registration.reload

        expect(existing_registration.name).to eq "Custom Name"
      end
    end
  end

  describe "#platform_registration_payload" do
    it "advertises the NRPS readonly scope at the top level" do
      registrar.register_platform!

      expect(WebMock).to have_requested(:post, "#{issuer}/api/lti/registrations").with { |req|
        body = JSON.parse(req.body)
        body["scope"] == Auth::Lti::Registrar::NRPS_READONLY_SCOPE
      }
    end

    it "advertises LtiDeepLinkingRequest in the tool-configuration messages array" do
      registrar.register_platform!

      expect(WebMock).to have_requested(:post, "#{issuer}/api/lti/registrations").with { |req|
        body = JSON.parse(req.body)
        messages = body.dig("https://purl.imsglobal.org/spec/lti-tool-configuration", "messages")
        messages.is_a?(Array) && messages.any? { |m| m["type"] == "LtiDeepLinkingRequest" }
      }
    end

    it "preserves the existing LtiResourceLinkRequest message entry" do
      registrar.register_platform!

      expect(WebMock).to have_requested(:post, "#{issuer}/api/lti/registrations").with { |req|
        body = JSON.parse(req.body)
        messages = body.dig("https://purl.imsglobal.org/spec/lti-tool-configuration", "messages")
        messages.any? { |m| m["type"] == "LtiResourceLinkRequest" }
      }
    end

    it "uses the tool client_uri as target_link_uri for the DL message" do
      registrar.register_platform!

      expect(WebMock).to have_requested(:post, "#{issuer}/api/lti/registrations").with { |req|
        body = JSON.parse(req.body)
        dl_msg = body.dig("https://purl.imsglobal.org/spec/lti-tool-configuration", "messages")
                   &.find { |m| m["type"] == "LtiDeepLinkingRequest" }
        dl_msg && dl_msg["target_link_uri"].present?
      }
    end
  end

  describe "#valid?" do
    context "when the issuer allowlist is defined" do
      before do
        Settings.instance.update!(lti: { enabled: true, autoregistration: true, issuer_allowlist: [issuer] })
      end

      it "allows an issuer in the allowlist" do
        registrar.ensure_valid_configuration!
        expect(registrar).to be_valid
      end
    end

    context "when the issuer is not in the allowlist" do
      before do
        Settings.instance.update!(lti: { enabled: true, autoregistration: true, issuer_allowlist: ["https://other.example.com"] })
      end

      it "rejects the issuer" do
        registrar.ensure_valid_configuration!
        expect(registrar).not_to be_valid
        expect(registrar.errors).to include("Autoregistration for this platform is not allowed")
      end
    end

    context "when the allowlist is empty" do
      before do
        Settings.instance.update!(lti: { enabled: true, autoregistration: true, issuer_allowlist: [] })
      end

      it "allows any issuer" do
        registrar.ensure_valid_configuration!
        expect(registrar).to be_valid
      end
    end
  end

  describe "scope normalization" do
    it "maps known LTI scope URIs to enum values" do
      registrar.register_platform!
      expect(LtiRegistration.last.scopes).to eq %w[nrps_membership_readonly ags_lineitem]
    end

    context "with unrecognized scopes" do
      let(:platform_registration_response) do
        {
          client_id: "10000000000001",
          token_endpoint_auth_method: "private_key_jwt",
          grant_types: %w[implicit client_credentials],
          scope: "https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly https://unknown.example.com/scope",
          "https://purl.imsglobal.org/spec/lti-tool-configuration": {}
        }
      end

      it "discards unrecognized scopes" do
        registrar.register_platform!
        expect(LtiRegistration.last.scopes).to eq %w[nrps_membership_readonly]
      end
    end
  end
end
