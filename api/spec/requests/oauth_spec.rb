# frozen_string_literal: true

RSpec.describe "External auth (OIDC / SAML) callback", type: :request do
  include_context "omniauth request"

  let(:omniauth_uid) { "12345" }
  let(:user_group) { FactoryBot.create(:user_group) }
  let(:entitleable) { FactoryBot.create(:project) }

  let!(:user_group_external_identifier) { FactoryBot.create(:external_identifier, identifiable: user_group) }
  let!(:entitleable_external_identifier) { FactoryBot.create(:external_identifier, identifiable: entitleable) }

  let(:auth_hash) do
    OmniAuth::AuthHash.new(
      provider: provider,
      uid: omniauth_uid,
      info: {
        first_name: Faker::Name.first_name,
        last_name: Faker::Name.last_name,
        email: Faker::Internet.email,
        user_groups: user_group.external_identifier.identifier,
        entitlements: entitleable.external_identifier.identifier
      }
    )
  end

  before do
    allow(AuthConfig).to receive(:provider_names).and_return(%w[openid_connect saml])
    OmniAuth.config.mock_auth[provider.to_sym] = auth_hash
    Rails.application.env_config["omniauth.auth"] = auth_hash
  end

  after do
    OmniAuth.config.mock_auth[provider.to_sym] = nil
    Rails.application.env_config["omniauth.auth"] = nil
  end

  # The callback flow (FindUser + HandleExternalAuth) is provider-agnostic: it
  # reads identity, user groups, and entitlements from the mocked auth hash the
  # same way for any OmniAuth provider. We exercise it for one OIDC and one SAML
  # provider by posting straight to the callback with the assertion in place.
  shared_examples "an external auth callback" do
    def callback!
      post "/auth/#{provider}/callback"
    end

    it "redirects after a successful callback" do
      callback!
      expect(response).to have_http_status(:redirect)
    end

    it "creates an identity for a new user" do
      expect { callback! }.to change(Identity, :count).by(1)
    end

    it "applies the user groups named in the assertion" do
      expect { callback! }.to change(UserGroupMembership, :count).by(1)
    end

    it "creates the entitlements named in the assertion" do
      expect { callback! }.to change(Entitlement, :count).by(1)
    end

    context "with an existing user and identity" do
      let!(:user) { FactoryBot.create(:user) }
      let!(:identity) { FactoryBot.create(:identity, user: user, provider: provider, uid: omniauth_uid) }

      context "whose user group is no longer asserted" do
        let!(:membership) { FactoryBot.create(:user_group_membership, user_group:, user:, source: identity) }

        before { auth_hash.info.user_groups = nil }

        it "removes the managed membership" do
          expect { callback! }.to change(UserGroupMembership, :count).by(-1)
        end
      end

      context "whose entitlement is no longer asserted" do
        let!(:entitlement) do
          FactoryBot.create(:entitlement, :read_access,
                            target: user, entitler: identity.to_upsertable_entitler, subject: entitleable)
        end

        before { auth_hash.info.entitlements = nil }

        it "removes the managed entitlement" do
          expect { callback! }.to change(Entitlement, :count).by(-1)
        end
      end
    end
  end

  context "an OIDC provider" do
    let(:provider) { "openid_connect" }

    it_behaves_like "an external auth callback"
  end

  context "a SAML provider" do
    let(:provider) { "saml" }

    it_behaves_like "an external auth callback"
  end

  # Regression: the deep-linking branch must not intercept resource-link launches.
  # An LtiResourceLinkRequest callback must continue to redirect to /oauth.
  context "a mocked LTI resource link launch" do
    let(:provider) { :lti }

    let!(:registration) do
      FactoryBot.create(:lti_registration, issuer: "https://canvas.example.com", client_id: "tool-client-id")
    end
    let!(:deployment) do
      FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "deploy-1")
    end
    let(:user) { FactoryBot.create(:user) }
    let!(:identity) { FactoryBot.create(:identity, user: user, provider: "lti", uid: "https://canvas.example.com|user-1") }

    let(:auth_hash) do
      OmniAuth::AuthHash.new(
        "provider" => "lti",
        "uid"      => "https://canvas.example.com|user-1",
        "info"     => { "email" => user.email },
        "extra"    => {
          "raw_info" => { "iss" => registration.issuer, "aud" => registration.client_id, "email" => user.email },
          "lti"      => { "message_type" => "LtiResourceLinkRequest", "deployment_id" => deployment.deployment_id },
          "target_link_uri" => Rails.configuration.manifold.url
        }
      )
    end

    it "redirects to /oauth on the React client" do
      post "/auth/lti/callback"

      expect(response).to have_http_status(:redirect)
      expect(response.location).to include("#{Rails.configuration.manifold.url}/oauth")
    end
  end
end
