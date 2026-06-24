# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::ResourceLink::Enroll do
  let(:registration) do
    FactoryBot.create(:lti_registration, issuer: "https://canvas.example.com", client_id: "tool-client-id")
  end
  let(:deployment) { FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "deploy-1") }
  let(:course_context) { FactoryBot.create(:lti_course_context, lti_deployment: deployment) }
  let(:reading_group) { FactoryBot.create(:reading_group) }
  let(:project) { FactoryBot.create(:project) }
  let(:user) { FactoryBot.create(:user) }

  let(:learner_role) { "http://purl.imsglobal.org/vocab/lis/v2/membership#Learner" }
  let(:instructor_role) { "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor" }
  let(:roles) { [learner_role] }
  let(:launched_id) { project.id }

  let(:omniauth_hash) do
    {
      "extra" => {
        "raw_info"        => { "iss" => registration.issuer, "aud" => registration.client_id },
        "lti"             => {
          "deployment_id" => deployment.deployment_id,
          "context"       => { "id" => course_context.context_id },
          "roles"         => roles
        },
        "target_link_uri" => "#{Rails.configuration.manifold.url}/lti/launch?redirect_type=Project&redirect_id=#{launched_id}"
      }
    }
  end

  subject(:enroll) { described_class.new(omniauth_hash, user).call }

  before do
    course_context.update!(reading_group: reading_group)
    reading_group.collect_model!(project)
  end

  def membership
    reading_group.reading_group_memberships.find_by(user: user)
  end

  context "when a learner launches a resource in the group" do
    it "enrolls them as a member" do
      enroll
      expect(membership).to be_present
      expect(reading_group.moderators).not_to include(user)
    end
  end

  context "when an instructor launches a resource in the group" do
    let(:roles) { [instructor_role] }

    it "enrolls them as a moderator" do
      enroll
      expect(reading_group.moderators).to include(user)
    end
  end

  context "when the course has no reading group" do
    before { course_context.update!(reading_group: nil) }

    it "does nothing" do
      expect { enroll }.not_to change(ReadingGroupMembership, :count)
    end
  end

  context "when the launched resource is not in the group" do
    let(:launched_id) { FactoryBot.create(:project).id }

    it "does nothing (treats it as a one-off link)" do
      expect { enroll }.not_to change(ReadingGroupMembership, :count)
    end
  end

  context "when the user is already a moderator and re-launches as a learner" do
    before { reading_group.reading_group_memberships.create!(user: user, role: :moderator) }

    it "does not downgrade them (ratchet)" do
      enroll
      expect(reading_group.moderators).to include(user)
    end
  end

  it "is idempotent across repeated launches" do
    described_class.new(omniauth_hash, user).call
    expect { described_class.new(omniauth_hash, user).call }.not_to change(ReadingGroupMembership, :count)
  end
end
