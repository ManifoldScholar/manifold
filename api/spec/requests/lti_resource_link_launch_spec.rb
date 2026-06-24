# frozen_string_literal: true

require "rails_helper"

RSpec.describe "LTI resource-link launch", type: :request do
  include_context "omniauth request"

  let!(:registration) do
    FactoryBot.create(:lti_registration, issuer: "https://canvas.example.com", client_id: "tool-client-id")
  end
  let!(:deployment) { FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "deploy-1") }
  let(:user) { FactoryBot.create(:user) }
  let!(:identity) { FactoryBot.create(:identity, user: user, provider: "lti", uid: "https://canvas.example.com|user-1") }

  let(:reading_group) { FactoryBot.create(:reading_group) }
  let(:project) { FactoryBot.create(:project) }
  let!(:course_context) do
    FactoryBot.create(:lti_course_context, lti_deployment: deployment, reading_group: reading_group)
  end

  let(:roles) { ["http://purl.imsglobal.org/vocab/lis/v2/membership#Learner"] }

  let(:auth_hash) do
    OmniAuth::AuthHash.new(
      "provider" => "lti",
      "uid"      => "https://canvas.example.com|user-1",
      "info"     => { "email" => user.email },
      "extra"    => {
        "raw_info"        => { "iss" => registration.issuer, "aud" => registration.client_id, "email" => user.email },
        "lti"             => {
          "message_type"  => "LtiResourceLinkRequest",
          "deployment_id" => deployment.deployment_id,
          "context"       => { "id" => course_context.context_id },
          "roles"         => roles
        },
        "target_link_uri" => "#{Rails.configuration.manifold.url}/lti/launch?redirect_type=Project&redirect_id=#{project.id}"
      }
    )
  end

  before do
    reading_group.collect_model!(project)
    OmniAuth.config.mock_auth[:lti] = auth_hash
    Rails.application.env_config["omniauth.auth"] = auth_hash
  end

  after do
    OmniAuth.config.mock_auth[:lti] = nil
    Rails.application.env_config["omniauth.auth"] = nil
  end

  it "enrolls the launching user and redirects with the resource redirect params" do
    expect { post "/auth/lti/callback" }
      .to change { reading_group.reading_group_memberships.where(user: user).count }.from(0).to(1)

    expect(response).to have_http_status(:redirect)
    parsed = Rack::Utils.parse_nested_query(URI.parse(response.location).query)
    expect(parsed).to include("redirect_type" => "Project", "redirect_id" => project.id)
  end

  context "when the launcher is an instructor" do
    let(:roles) { ["http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"] }

    it "enrolls them as a moderator" do
      post "/auth/lti/callback"
      expect(reading_group.moderators).to include(user)
    end
  end
end
