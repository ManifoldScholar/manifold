# frozen_string_literal: true

RSpec.describe "Oauth", type: :request do
  include_context "omniauth request"

  let(:user_group) { FactoryBot.create(:user_group) }
  let(:entitleable) { FactoryBot.create(:project) }

  let!(:omniauth_uid) { "12345" }

  let!(:user_group_external_identifier) { FactoryBot.create(:external_identifier, identifiable: user_group) }
  let!(:entitleable_external_identifier) { FactoryBot.create(:external_identifier, identifiable: entitleable) }

  let(:provider) { raise "provider must be defined" }

  let(:auth_hash) do
    {
      provider: provider.to_s,
      uid: omniauth_uid,
      info: {
        first_name: Faker::Name.first_name,
        last_name: Faker::Name.last_name,
        email: Faker::Internet.email,
        user_groups: [user_group.external_identifier&.identifier].compact.join(";"),
        entitlements: [entitleable.external_identifier&.identifier].compact.join(";")
      }
    }
  end

  before do
    OmniAuth.config.mock_auth[provider] = OmniAuth::AuthHash.new(auth_hash)
    Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[provider]
  end

  context "as mocked google_oauth2 OAuth" do
    let(:provider) { :google_oauth2 }

    before do
      Settings.instance.tap do |settings|
        settings.integrations.google_oauth_client_id = "TEST"
        settings.secrets.google_oauth_client_secret = "TEST"
      end.save
    end

    describe "/auth/:provider/callback" do
      describe "the response" do
        it "responds with a redirect" do
          post "/auth/google_oauth2"
          follow_redirect!
          expect(response).to have_http_status(:redirect)
        end
      end

      context "with user groups defined" do
        it "applies user groups" do
          expect do
            post "/auth/google_oauth2"
            follow_redirect!
          end.to change(UserGroupMembership, :count).by(1)
        end
      end

      context "with entitlements defined" do
        it "creates entitlements" do
          expect do
            post "/auth/google_oauth2"
            follow_redirect!
          end.to change(Entitlement, :count).by(1)
        end
      end

      context "with an existing user" do
        let!(:user) { FactoryBot.create(:user) }
        let!(:identity) { FactoryBot.create(:identity, user: user, provider: provider.to_s, uid: omniauth_uid) }

        context "with an existing user group membership associated with the identity" do
          let!(:user_group_membership) { FactoryBot.create(:user_group_membership, user_group:, user:, source: identity) }

          context "and an OAuth request that does NOT include the user group" do
            before do
              OmniAuth.config.mock_auth[provider][:info][:user_groups] = nil
            end

            it "removes the user group membership" do
              expect do
                post "/auth/google_oauth2"
                follow_redirect!
              end.to change(UserGroupMembership, :count).by(-1)
            end
          end
        end

        context "with an existing entitlement associated with the identity" do
          let!(:entitlement) do
            FactoryBot.create(:entitlement,
                              :read_access,
                              target: user,
                              entitler: identity.to_upsertable_entitler,
                              subject: entitleable
                             )
          end

          context "and an OAuth request that does NOT include the entitleable" do
            before do
              OmniAuth.config.mock_auth[provider][:info][:entitlements] = nil
            end

            it "removes the entitlement" do
              expect do
                post "/auth/google_oauth2"
                follow_redirect!
              end.to change(Entitlement, :count).by(-1)
            end
          end
        end
      end
    end
  end

  context "as mocked SAML" do
    let(:provider) { :saml }

    before do
      allow(SamlConfig).to receive(:provider_names).and_return([provider.to_s])
      allow_any_instance_of(SamlConfig).to receive(:provider_names).and_return([provider.to_s])
      allow_any_instance_of(AbstractSamlProviderConfig).to receive(:enabled?).and_return(true)

      # Clear any cached config
      SamlConfig.instance_variable_set("@instance", nil)
    end

    it "creates the identity" do
      expect do
        post "/auth/saml"
        follow_redirect!
      end.to change(Identity, :count).by(1)
    end
  end

  # Regression: the DL branch added in Plan 02-03 must not intercept resource link launches.
  # An LtiResourceLinkRequest callback must continue to redirect to /oauth on the React client.
  context "as a mocked LTI resource link launch (regression for the DL branch)" do
    # Override `provider` so the outer before block does not raise when it tries to set
    # OmniAuth.config.mock_auth[provider]. Our inner before block overwrites with the full
    # LTI auth hash before the request is made.
    let(:provider) { :lti }

    let!(:registration) do
      FactoryBot.create(:lti_registration,
                        issuer: "https://canvas.example.com",
                        client_id: "tool-client-id")
    end
    let!(:deployment) do
      FactoryBot.create(:lti_deployment,
                        lti_registration: registration,
                        deployment_id: "deploy-1")
    end
    let(:user) { FactoryBot.create(:user) }
    let!(:identity) { FactoryBot.create(:identity, user: user, provider: "lti", uid: "https://canvas.example.com|user-1") }

    let(:lti_auth_hash) do
      OmniAuth::AuthHash.new(
        "provider" => "lti",
        "uid"      => "https://canvas.example.com|user-1",
        "info"     => { "email" => user.email },
        "extra"    => {
          "raw_info" => {
            "iss"   => registration.issuer,
            "aud"   => registration.client_id,
            "sub"   => "user-1",
            "email" => user.email
          },
          "lti"             => {
            "message_type"  => "LtiResourceLinkRequest",
            "deployment_id" => deployment.deployment_id
          },
          "target_link_uri" => Rails.configuration.manifold.url
        }
      )
    end

    before do
      OmniAuth.config.mock_auth[:lti] = lti_auth_hash
      Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[:lti]
    end

    after do
      OmniAuth.config.mock_auth[:lti] = nil
      Rails.application.env_config["omniauth.auth"] = nil
    end

    it "redirects to /oauth on the React client (not to /lti/picker)" do
      post "/auth/lti/callback"

      expect(response).to have_http_status(:redirect)
      expect(response.location).to include("#{Rails.configuration.manifold.url}/oauth")
      expect(response.location).not_to include("/lti/picker")
    end
  end
end
