# frozen_string_literal: true

RSpec.describe "Oauth", type: :request do
  include_context "omniauth request"

  let(:user_group) { FactoryBot.create(:user_group) }
  let(:entitleable) { FactoryBot.create(:project) }

  let!(:omniauth_uid) { "12345" }

  let!(:user_group_external_identifier) { FactoryBot.create(:external_identifier, identifiable: user_group) }
  let!(:entitleable_external_identifier) { FactoryBot.create(:external_identifier, identifiable: entitleable) }

  let(:provider) { }

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

      # Clear any cached config
      SamlConfig.instance_variable_set("@instance", nil)
    end

    it "creates the identity" do
      expect do
        post "/auth/saml"
        follow_redirect!
      end.to change { Identity.count }.by(1)
    end
  end
end
