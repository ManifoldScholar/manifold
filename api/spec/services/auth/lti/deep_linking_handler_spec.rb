# frozen_string_literal: true

require "rails_helper"

RSpec.describe Auth::Lti::DeepLinkingHandler do
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

    it "returns ok: true" do
      expect(result.ok).to be true
    end

    it "returns a 64-character hex token" do
      expect(result.token).to match(/\A[0-9a-f]{64}\z/)
    end

    it "returns accept_types from the deep linking settings" do
      expect(result.accept_types).to eq(["ltiResourceLink"])
    end

    it "returns accept_multiple from the deep linking settings" do
      expect(result.accept_multiple).to be true
    end

    it "returns deep_link_return_url from the deep linking settings" do
      expect(result.deep_link_return_url).to eq("https://canvas.example.com/dl_return")
    end

    it "coerces a missing accept_types to an empty array" do
      dl_settings.delete("accept_types")
      expect(result.accept_types).to eq([])
    end

    it "returns nil message and nil log_level on success" do
      expect(result.message).to be_nil
      expect(result.log_level).to be_nil
    end
  end

  describe "#call — DeepLinkingContext::Error failure path" do
    before do
      dl_settings.delete("deep_link_return_url")
    end

    subject(:result) { handler.call }

    it "returns ok: false" do
      expect(result.ok).to be false
    end

    it "returns a categorized error message" do
      expect(result.message).to eq("Invalid request")
    end

    it "returns log_level :warn" do
      expect(result.log_level).to eq(:warn)
    end

    it "returns nil token" do
      expect(result.token).to be_nil
    end

    it "returns nil accept_types" do
      expect(result.accept_types).to be_nil
    end

    it "returns nil accept_multiple" do
      expect(result.accept_multiple).to be_nil
    end

    it "returns nil deep_link_return_url" do
      expect(result.deep_link_return_url).to be_nil
    end
  end

  describe "#call — unexpected StandardError failure path" do
    before do
      allow(Auth::Lti::DeepLinkingContext).to receive(:new)
        .and_raise(StandardError, "simulated failure")
    end

    subject(:result) { handler.call }

    it "returns ok: false" do
      expect(result.ok).to be false
    end

    it "returns the generic error message" do
      expect(result.message).to eq("Session expired or unrecognized")
    end

    it "returns log_level :error" do
      expect(result.log_level).to eq(:error)
    end

    it "returns nil token" do
      expect(result.token).to be_nil
    end

    it "returns nil accept_types" do
      expect(result.accept_types).to be_nil
    end

    it "returns nil accept_multiple" do
      expect(result.accept_multiple).to be_nil
    end

    it "returns nil deep_link_return_url" do
      expect(result.deep_link_return_url).to be_nil
    end
  end
end
