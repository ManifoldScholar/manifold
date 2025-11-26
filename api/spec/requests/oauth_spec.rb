# frozen_string_literal: true

RSpec.describe "Oauth", type: :request do

  before { OmniAuth.config.test_mode }

  context "as mocked google_oauth2 OAuth" do
    before do
      Settings.instance.tap do |settings|
        settings.integrations.google_oauth_client_id = "TEST"
        settings.secrets.google_oauth_client_secret = "TEST"
      end.save

      OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new({
        provider: "google_oauth2",
        uid: "12345",
        info: {
          first_name: Faker::Name.first_name,
          last_name: Faker::Name.last_name,
          user_groups: [external_identifier&.identifier].compact
        }
      })

      Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[:google_oauth2]
    end

    describe "responds with a list of projects" do
      before { post "/auth/google_oauth2/callback" }

      describe "the response" do
        it "has a non-blank body" do
          expect(response.body.blank?).to be false
        end

        it "has a 200 status code" do
          get api_v1_projects_path
          expect(response).to have_http_status(:ok)
        end
      end
    end

    context "with user groups defined" do
      let!(:user_group) { FactoryBot.create(:user_group) }
      let!(:external_identifier) { FactoryBot.create(:external_identifier, identifiable: user_group) }

      it "applies user groups" do
        expect do
          get "/auth/google_oauth2/callback"
        end.to change(UserGroupMembership, :count).by(1)
      end
    end
  end

  context "as mocked SAML" do
    let(:provider_name) { "saml" }

    let!(:project) { FactoryBot.create(:project) }
    let!(:external_identifier) { FactoryBot.create(:external_identifier, identifiable: project) }

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
