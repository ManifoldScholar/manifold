# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::Launch do
  let(:registration) do
    FactoryBot.create(:lti_registration, issuer: "https://canvas.example.com", client_id: "tool-client-id")
  end
  let(:deployment) { FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "deploy-1") }

  let(:omniauth_hash) do
    {
      "extra" => {
        "raw_info"        => { "iss" => registration.issuer, "aud" => registration.client_id },
        "lti"             => {
          "deployment_id" => deployment.deployment_id,
          "message_type"  => "LtiResourceLinkRequest",
          "roles"         => ["http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"],
          "context"       => { "id" => "ctx-1", "title" => "Intro", "label" => "CS101", "type" => ["CourseSection"] },
          "deep_linking_settings" => { "deep_link_return_url" => "https://canvas.example.com/dl" }
        },
        "target_link_uri" => "https://manifold.test/lti/launch?redirect_type=Project&redirect_id=x"
      }
    }
  end

  subject(:launch) { described_class.new(omniauth_hash) }

  it "exposes the LTI claims" do
    expect(launch).to have_attributes(
      issuer: registration.issuer,
      client_id: registration.client_id,
      deployment_id: "deploy-1",
      message_type: "LtiResourceLinkRequest",
      roles: ["http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"],
      context_id: "ctx-1",
      context_title: "Intro",
      context_label: "CS101",
      context_type: "CourseSection",
      target_link_uri: "https://manifold.test/lti/launch?redirect_type=Project&redirect_id=x"
    )
    expect(launch.deep_linking_settings).to include("deep_link_return_url" => "https://canvas.example.com/dl")
  end

  it "resolves the registration and deployment" do
    expect(launch.registration).to eq(registration)
    expect(launch.deployment).to eq(deployment)
  end

  it "returns nil deployment for an unrecorded deployment_id without creating one" do
    hash = omniauth_hash.deep_merge("extra" => { "lti" => { "deployment_id" => "unknown" } })

    expect { described_class.new(hash).deployment }.not_to change(LtiDeployment, :count)
    expect(described_class.new(hash).deployment).to be_nil
  end
end
