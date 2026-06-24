# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::DeepLinking::Context do
  let(:registration) do
    FactoryBot.create(:lti_registration,
                      issuer: "https://canvas.example.com",
                      client_id: "tool-client-id")
  end
  let(:deployment) { FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "deploy-1") }
  let(:user)       { FactoryBot.create(:user) }

  let(:context_id) { "course-ctx-42" }

  let(:dl_settings) do
    {
      "deep_link_return_url" => "https://canvas.example.com/dl_return",
      "accept_types"         => ["ltiResourceLink"],
      "accept_multiple"      => true,
      "data"                 => "opaque-platform-data"
    }
  end

  let(:lti_claim_hash) do
    {
      "message_type"          => "LtiDeepLinkingRequest",
      "deployment_id"         => deployment.deployment_id,
      "context"               => {
        "id"    => context_id,
        "title" => "Intro to Ruby",
        "label" => "CS101",
        "type"  => ["http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection"]
      },
      "deep_linking_settings" => dl_settings
    }
  end

  let(:raw_info_claims) do
    {
      "iss"   => registration.issuer,
      "aud"   => registration.client_id,
      "sub"   => "user-1",
      "nonce" => "abc",
      "iat"   => Time.now.to_i,
      "exp"   => Time.now.to_i + 300
    }
  end

  let(:omniauth_hash) do
    {
      "provider" => "lti",
      "uid"      => "#{registration.issuer}|user-1",
      "extra"    => {
        "raw_info"        => raw_info_claims,
        "lti"             => lti_claim_hash,
        "target_link_uri" => "https://manifold.test/"
      }
    }
  end

  subject(:context) { described_class.from_launch(omniauth_hash, user) }

  before do
    Rails.cache.clear
    deployment # ensure created before each example
  end

  describe "#persist!" do
    it "returns a 64-character hex token" do
      expect(context.persist!).to match(/\A[0-9a-f]{64}\z/)
    end

    it "writes the DL context under `lti/dl/<token>`" do
      token = context.persist!

      expect(Rails.cache.read("lti/dl/#{token}")).to include(
        "data"                 => "opaque-platform-data",
        "deep_link_return_url" => "https://canvas.example.com/dl_return",
        "accept_types"         => ["ltiResourceLink"],
        "accept_multiple"      => true,
        "deployment_id"        => deployment.deployment_id,
        "iss"                  => registration.issuer,
        "client_id"            => registration.client_id,
        "user_id"              => user.id
      )
    end

    it "links the cached payload to the LtiCourseContext that was found-or-created" do
      token = context.persist!
      cached = Rails.cache.read("lti/dl/#{token}")
      course_context = LtiCourseContext.find_by!(lti_deployment: deployment, context_id: context_id)

      expect(cached["lti_course_context_id"]).to eq(course_context.id)
      expect(course_context).to have_attributes(
        context_title: "Intro to Ruby",
        context_label: "CS101",
        context_type: "http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection"
      )
    end

    it "produces a different token on each call" do
      token1 = described_class.from_launch(omniauth_hash, user).persist!
      token2 = described_class.from_launch(omniauth_hash, user).persist!

      expect(token1).not_to eq(token2)
      expect(Rails.cache.read("lti/dl/#{token1}")).to be_present
      expect(Rails.cache.read("lti/dl/#{token2}")).to be_present
    end

    it "reuses the LtiCourseContext for the same context_id (idempotent)" do
      context.persist!
      expect do
        described_class.from_launch(omniauth_hash, user).persist!
      end.not_to change(LtiCourseContext, :count)
    end

    it "raises IdempotencyError when persisted twice on the same instance" do
      context.persist!
      expect { context.persist! }.to raise_error(Lti::DeepLinking::Context::IdempotencyError)
    end

    it "raises InvalidRequestError when deep_link_return_url is missing" do
      dl_settings.delete("deep_link_return_url")
      expect { context.persist! }.to raise_error(Lti::DeepLinking::Context::InvalidRequestError, /Missing deep_link_return_url/)
    end

    it "raises InvalidRequestError when deep_linking_settings is absent entirely" do
      lti_claim_hash.delete("deep_linking_settings")
      expect { context.persist! }.to raise_error(Lti::DeepLinking::Context::InvalidRequestError, /Missing deep_link_return_url/)
    end

    it "writes nothing to the cache when validation fails" do
      dl_settings.delete("deep_link_return_url")
      expect(Rails.cache).not_to receive(:write)
      expect { context.persist! }.to raise_error(Lti::DeepLinking::Context::Error)
    end

    it "uses the first element of the context type array" do
      context.persist!
      course_context = LtiCourseContext.find_by!(lti_deployment: deployment, context_id: context_id)
      expect(course_context.context_type).to eq("http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection")
    end

    it "rescues ActiveRecord::RecordNotUnique on LtiCourseContext race and falls back to find_by!" do
      existing = LtiCourseContext.create!(
        lti_deployment: deployment,
        context_id: context_id,
        context_title: "Intro to Ruby",
        context_label: "CS101",
        context_type: "http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection"
      )

      allow(LtiCourseContext).to receive(:find_or_create_by!).and_raise(ActiveRecord::RecordNotUnique)
      allow(LtiCourseContext).to receive(:find_by!).and_call_original

      token = context.persist!
      expect(Rails.cache.read("lti/dl/#{token}")["lti_course_context_id"]).to eq(existing.id)
      expect(LtiCourseContext).to have_received(:find_by!).with(lti_deployment: deployment, context_id: context_id)
    end
  end

  describe ".find and readers" do
    subject(:found) { described_class.find(context.persist!) }

    it "loads a persisted context exposing its fields" do
      expect(found).to have_attributes(
        accept_types: ["ltiResourceLink"],
        accept_multiple: true,
        deep_link_return_url: "https://canvas.example.com/dl_return",
        client_id: registration.client_id,
        iss: registration.issuer,
        deployment_id: deployment.deployment_id,
        data: "opaque-platform-data",
        user_id: user.id
      )
      expect(found.lti_course_context_id).to be_present
    end

    it "returns nil for an unknown or expired token" do
      expect(described_class.find("does-not-exist")).to be_nil
    end
  end

  describe "#owned_by?" do
    subject(:found) { described_class.find(context.persist!) }

    it "is true for the launching user and false for anyone else" do
      expect(found).to be_owned_by(user)
      expect(found).not_to be_owned_by(FactoryBot.create(:user))
    end
  end

  describe "#consume!" do
    it "deletes the cached context" do
      token = context.persist!
      described_class.find(token).consume!
      expect(described_class.find(token)).to be_nil
    end
  end

  describe "Error class hierarchy (controller integration contract)" do
    it "InvalidRequestError descends from Error, which is rescuable" do
      expect(Lti::DeepLinking::Context::InvalidRequestError.ancestors).to include(Lti::DeepLinking::Context::Error)
      expect(Lti::DeepLinking::Context::Error.ancestors).to include(StandardError)
    end
  end
end
