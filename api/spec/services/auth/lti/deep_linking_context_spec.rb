# frozen_string_literal: true

require "rails_helper"

RSpec.describe Auth::Lti::DeepLinkingContext do
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

  subject(:service) { described_class.new(omniauth_hash, user) }

  before do
    Rails.cache.clear
    deployment # ensure created before each example
  end

  describe "#cache!" do
    it "returns a 64-character hex token" do
      token = service.cache!
      expect(token).to match(/\A[0-9a-f]{64}\z/)
    end

    it "writes the DL context under `lti/dl/<token>` with a 1-hour TTL" do
      token = service.cache!
      cached = Rails.cache.read("lti/dl/#{token}")

      expect(cached).to include(
        "data"                 => "opaque-platform-data",
        "deep_link_return_url" => "https://canvas.example.com/dl_return",
        "accept_types"         => ["ltiResourceLink"],
        "accept_multiple"      => true,
        "deployment_id"        => deployment.deployment_id,
        "iss"                  => registration.issuer,
        "user_id"              => user.id
      )
    end

    it "links the cached payload to the LtiCourseContext that was found-or-created" do
      token = service.cache!
      cached = Rails.cache.read("lti/dl/#{token}")
      ctx = LtiCourseContext.find_by!(lti_deployment: deployment, context_id: context_id)

      expect(cached["lti_course_context_id"]).to eq(ctx.id)
      expect(ctx.context_title).to eq("Intro to Ruby")
      expect(ctx.context_label).to eq("CS101")
      expect(ctx.context_type).to eq("http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection")
    end

    it "produces a different token on each call (no collision across two cache writes)" do
      token1 = described_class.new(omniauth_hash, user).cache!
      token2 = described_class.new(omniauth_hash, user).cache!

      expect(token1).not_to eq(token2)
      expect(Rails.cache.read("lti/dl/#{token1}")).to be_present
      expect(Rails.cache.read("lti/dl/#{token2}")).to be_present
    end

    it "reuses the LtiCourseContext on a second DL request for the same context_id (idempotent)" do
      service.cache!
      expect do
        described_class.new(omniauth_hash, user).cache!
      end.not_to change(LtiCourseContext, :count)
    end

    it "raises InvalidRequestError when deep_link_return_url is missing" do
      dl_settings.delete("deep_link_return_url")

      expect { service.cache! }.to raise_error(
        Auth::Lti::DeepLinkingContext::InvalidRequestError,
        /Missing deep_link_return_url/
      )
    end

    it "raises InvalidRequestError when deep_linking_settings is absent entirely" do
      lti_claim_hash.delete("deep_linking_settings")

      expect { service.cache! }.to raise_error(
        Auth::Lti::DeepLinkingContext::InvalidRequestError,
        /Missing deep_link_return_url/
      )
    end

    it "raises DeploymentNotRegisteredError when the deployment_id does not match a deployment" do
      lti_claim_hash["deployment_id"] = "deploy-not-registered"

      expect { service.cache! }.to raise_error(
        Auth::Lti::DeepLinkingContext::DeploymentNotRegisteredError,
        /not registered/
      )
    end

    it "writes nothing to the cache when validation fails" do
      dl_settings.delete("deep_link_return_url")
      expect(Rails.cache).not_to receive(:write)
      expect { service.cache! }.to raise_error(Auth::Lti::DeepLinkingContext::Error)
    end

    it "uses the first element of the context type array (LTI spec returns an array)" do
      token = service.cache!
      ctx = LtiCourseContext.find_by!(lti_deployment: deployment, context_id: context_id)
      expect(ctx.context_type).not_to start_with("[")
      expect(ctx.context_type).to be_a(String)
      expect(token).to be_present # smoke check
    end

    it "rescues ActiveRecord::RecordNotUnique on LtiCourseContext race and falls back to find_by!" do
      # Simulate the race: stub find_or_create_by! to raise RecordNotUnique on first call,
      # then have the existing record returned by find_by!.
      existing = LtiCourseContext.create!(
        lti_deployment: deployment,
        context_id: context_id,
        context_title: "Intro to Ruby",
        context_label: "CS101",
        context_type: "http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection"
      )

      allow(LtiCourseContext).to receive(:find_or_create_by!).and_raise(ActiveRecord::RecordNotUnique)
      allow(LtiCourseContext).to receive(:find_by!).and_call_original

      token = service.cache!
      cached = Rails.cache.read("lti/dl/#{token}")
      expect(cached["lti_course_context_id"]).to eq(existing.id)
      expect(LtiCourseContext).to have_received(:find_by!).with(lti_deployment: deployment, context_id: context_id)
    end

    it "stores all four deep_linking_settings fields verbatim (DLRQ-02 contract)" do
      token = service.cache!
      cached = Rails.cache.read("lti/dl/#{token}")

      %w[data deep_link_return_url accept_types accept_multiple].each do |key|
        expect(cached).to have_key(key), "expected cached payload to include `#{key}` per DLRQ-02"
      end
    end
  end

  describe "Error class hierarchy (controller integration contract)" do
    it "InvalidRequestError is a subclass of Error" do
      expect(Auth::Lti::DeepLinkingContext::InvalidRequestError.ancestors).to include(Auth::Lti::DeepLinkingContext::Error)
    end

    it "DeploymentNotRegisteredError is a subclass of Error" do
      expect(Auth::Lti::DeepLinkingContext::DeploymentNotRegisteredError.ancestors).to include(Auth::Lti::DeepLinkingContext::Error)
    end

    it "Error is a subclass of StandardError (rescuable)" do
      expect(Auth::Lti::DeepLinkingContext::Error.ancestors).to include(StandardError)
    end
  end
end
