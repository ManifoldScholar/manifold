# frozen_string_literal: true

RSpec.describe "Oauth", type: :request do
  include_context "omniauth request"

  let(:user_group) { FactoryBot.create(:user_group) }
  let(:entitleable) { FactoryBot.create(:project) }

  let!(:user_group_external_identifier) { FactoryBot.create(:external_identifier, identifiable: user_group) }
  let!(:entitleable_external_identifier) { FactoryBot.create(:external_identifier, identifiable: entitleable) }

  let(:provider) { }

  let(:auth_hash) do
    {
      provider: provider.to_s,
      uid: "12345",
      info: {
        first_name: Faker::Name.first_name,
        last_name: Faker::Name.last_name,
        email: Faker::Internet.email,
        user_groups: [user_group.external_identifier&.identifier].compact.join(";"),
        entitlements: [entitleable.external_identifier&.identifier].compact.join(";")
      }
    }
  end

  context "as mocked google_oauth2 OAuth" do
    let(:provider) { :google_oauth2 }

    before do
      Settings.instance.tap do |settings|
        settings.integrations.google_oauth_client_id = "TEST"
        settings.secrets.google_oauth_client_secret = "TEST"
      end.save

      OmniAuth.config.mock_auth[provider] = OmniAuth::AuthHash.new(auth_hash)
      Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[provider]
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
    end
  end

  context "as mocked SAML" do
    let(:provider_name) { "saml" }

    before do
      allow_any_instance_of(SamlConfig).to receive(:provider_names).and_return([provider_name])

      OmniAuth.config.mock_auth[:saml] = OmniAuth::AuthHash.new({
        provider: provider_name,
        uid: "12345",
        info: {
          first_name: Faker::Name.first_name,
          last_name: Faker::Name.last_name,
          email: Faker::Internet.email
        }
      })

      Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[:saml]
    end

    xit "does some shit" do
      expect do
        post "/auth/saml"
      end.to change { Identity.count }.by(1)
    end
  end
end
