# frozen_string_literal: true

require "rails_helper"

RSpec.describe ExternalAuth::Resolver do
  let(:user) { FactoryBot.create(:user) }
  let(:params) { { provider: "lti" } }

  let(:registration) do
    FactoryBot.create(:lti_registration, issuer: "https://canvas.example.com", client_id: "tool-client-id")
  end
  let(:deployment) do
    FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "deploy-1")
  end

  def lti_auth_hash(message_type: "LtiResourceLinkRequest", dl_settings: nil,
                    target: "#{Rails.configuration.manifold.url}/lti/launch?redirect_type=Project&redirect_id=p1")
    lti = { "message_type" => message_type, "deployment_id" => deployment.deployment_id,
            "context" => { "id" => "ctx-1" }, "roles" => [] }
    lti["deep_linking_settings"] = dl_settings if dl_settings

    OmniAuth::AuthHash.new(
      "provider" => "lti",
      "uid" => "#{registration.issuer}|user-1",
      "info" => { "email" => user.email },
      "extra" => {
        "raw_info" => { "iss" => registration.issuer, "aud" => registration.client_id, "sub" => "user-1" },
        "lti" => lti,
        "target_link_uri" => target
      }
    )
  end

  before do
    Rails.cache.clear
    deployment
  end

  describe "a resource-link launch" do
    subject(:resolver) { described_class.new(lti_auth_hash, user, params) }

    it "has no failure, no meta, and redirects to the resource" do
      expect(resolver.failure).to be_nil
      expect(resolver.meta).to eq({})
      expect(URI.parse(resolver.redirect_url).path).to eq("/oauth")
    end

    it "enrolls the user when the launched resource is in the course's reading group" do
      reading_group = FactoryBot.create(:reading_group)
      project = FactoryBot.create(:project)
      FactoryBot.create(:lti_course_context,
                        lti_deployment: deployment, context_id: "ctx-1", reading_group: reading_group)
      reading_group.collect_model!(project)
      target = "#{Rails.configuration.manifold.url}/lti/launch?redirect_type=Project&redirect_id=#{project.id}"

      expect { described_class.new(lti_auth_hash(target: target), user, params).redirect_url }
        .to change { reading_group.reading_group_memberships.where(user: user).count }.from(0).to(1)
    end
  end

  describe "a deep-linking launch" do
    let(:dl) { { "deep_link_return_url" => "https://canvas.example.com/return", "accept_types" => ["ltiResourceLink"] } }

    subject(:resolver) do
      described_class.new(lti_auth_hash(message_type: "LtiDeepLinkingRequest", dl_settings: dl), user, params)
    end

    it "persists the context and points meta at the picker" do
      expect(resolver.failure).to be_nil
      expect(resolver.meta[:linkRedirectPath]).to match(%r{\A/lti/deep_linking\?lti_context=[0-9a-f]{64}\z})
    end

    it "surfaces a failure when the deep-linking request is invalid" do
      bad = described_class.new(
        lti_auth_hash(message_type: "LtiDeepLinkingRequest", dl_settings: { "accept_types" => [] }), user, params
      )

      expect(bad.failure).to be_present
    end
  end

  describe "a non-LTI login" do
    let(:oauth_hash) do
      OmniAuth::AuthHash.new(
        "provider" => "google_oauth2",
        "info" => { "email" => user.email },
        "extra" => { "raw_info" => {}, "target_link_uri" => "#{Rails.configuration.manifold.url}/projects/x" }
      )
    end

    it "runs no effects and resolves the default destination" do
      resolver = described_class.new(oauth_hash, user, { provider: "google_oauth2" })

      expect(resolver.failure).to be_nil
      expect(resolver.meta).to eq({})
      expect(URI.parse(resolver.redirect_url).path).to eq("/oauth")
    end
  end
end
