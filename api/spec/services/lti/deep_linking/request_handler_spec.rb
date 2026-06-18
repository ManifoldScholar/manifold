# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::DeepLinking::RequestHandler do
  let(:registration) do
    FactoryBot.create(:lti_registration,
                      issuer: "https://canvas.example.com",
                      client_id: "tool-client-id")
  end
  let(:deployment) { FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "deploy-1") }
  let(:user)       { FactoryBot.create(:user) }

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
        "id"    => "course-ctx-42",
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

  subject(:handler) { described_class.new(omniauth_hash, user) }

  before do
    Rails.cache.clear
    deployment # ensure created before each example
  end

  describe "#call — success path" do
    subject(:result) { handler.call }

    it "returns a Success carrying the token and DL settings" do
      expect(result).to be_success
      expect(result.value!).to include(
        accept_types: ["ltiResourceLink"],
        accept_multiple: true,
        deep_link_return_url: "https://canvas.example.com/dl_return"
      )
      expect(result.value![:token]).to match(/\A[0-9a-f]{64}\z/)
    end

    it "coerces a missing accept_types to an empty array" do
      dl_settings.delete("accept_types")
      expect(result.value![:accept_types]).to eq([])
    end
  end

  describe "#call — Context::Error failure path" do
    before { dl_settings.delete("deep_link_return_url") }

    subject(:result) { handler.call }

    it "returns a Failure with the categorized message and :bad_request status" do
      expect(result).to be_failure
      expect(result.failure).to eq(message: "Invalid request", status: :bad_request)
    end
  end

  describe "#call — unexpected StandardError failure path" do
    before do
      allow(Lti::DeepLinking::Context).to receive(:new)
        .and_raise(StandardError, "simulated failure")
    end

    subject(:result) { handler.call }

    it "returns a Failure with the generic message and :internal_server_error status" do
      expect(result).to be_failure
      expect(result.failure).to eq(message: "Session expired or unrecognized", status: :internal_server_error)
    end
  end
end
