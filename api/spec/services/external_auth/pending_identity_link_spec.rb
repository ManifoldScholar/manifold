# frozen_string_literal: true

require "rails_helper"

RSpec.describe ExternalAuth::PendingIdentityLink do
  let(:user) { FactoryBot.create(:user) }

  let(:omniauth_hash) do
    OmniAuth::AuthHash.new(
      "provider" => "lti",
      "uid" => "https://canvas.example.com|user-1",
      "info" => { "email" => user.email },
      "extra" => {
        "raw_info" => { "iss" => "https://canvas.example.com", "aud" => "tool", "sub" => "user-1" },
        "lti" => { "message_type" => "LtiResourceLinkRequest" },
        "target_link_uri" => "https://manifold.test/"
      }
    )
  end

  subject(:pending) { described_class.build(omniauth_hash, user) }

  before { Rails.cache.clear }

  describe "#persist!" do
    it "returns a 64-character hex token and caches the parked identity" do
      token = pending.persist!

      expect(token).to match(/\A[0-9a-f]{64}\z/)
      expect(Rails.cache.read("external_auth/pending_identity_link/#{token}")).to include(
        user_id: user.id, provider: "lti", email: user.email
      )
    end

    it "mints a different token on each call" do
      expect(described_class.build(omniauth_hash, user).persist!)
        .not_to eq(described_class.build(omniauth_hash, user).persist!)
    end

    it "raises when persisted twice on the same instance" do
      pending.persist!
      expect { pending.persist! }.to raise_error(described_class::IdempotencyError)
    end
  end

  describe ".find and readers" do
    subject(:found) { described_class.find(pending.persist!) }

    it "exposes the parked fields and rewraps the auth hash" do
      expect(found).to have_attributes(user_id: user.id, provider: "lti", email: user.email)
      expect(found.auth_hash["uid"]).to eq("https://canvas.example.com|user-1")
      expect(found.auth_hash.info.email).to eq(user.email)
    end

    it "returns nil for an unknown or expired token" do
      expect(described_class.find("does-not-exist")).to be_nil
    end
  end

  describe "#owned_by?" do
    subject(:found) { described_class.find(pending.persist!) }

    it "is true only for the matched account" do
      expect(found).to be_owned_by(user)
      expect(found).not_to be_owned_by(FactoryBot.create(:user))
    end
  end

  describe "#consume!" do
    it "deletes the cached link" do
      token = pending.persist!
      described_class.find(token).consume!
      expect(described_class.find(token)).to be_nil
    end
  end

  describe "#touch!" do
    it "restarts the TTL from the moment it is touched" do
      token = pending.persist!

      Timecop.travel(14.minutes.from_now) { described_class.find(token).touch! }

      Timecop.travel(20.minutes.from_now) do
        expect(described_class.find(token)).to be_present
      end
    end
  end
end
