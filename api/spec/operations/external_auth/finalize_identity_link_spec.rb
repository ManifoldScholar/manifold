# frozen_string_literal: true

require "rails_helper"

RSpec.describe ExternalAuth::FinalizeIdentityLink do
  let(:user)  { FactoryBot.create(:user) }
  let(:other) { FactoryBot.create(:user) }
  let(:uid)   { "https://canvas.example.com|user-1" }

  def lti_auth_hash
    OmniAuth::AuthHash.new(
      "provider" => "lti",
      "uid" => uid,
      "info" => { "email" => user.email },
      "extra" => {
        "raw_info" => { "iss" => "https://canvas.example.com", "sub" => "user-1" },
        "lti" => { "message_type" => "LtiResourceLinkRequest" }
      }
    )
  end

  def park(owner)
    ExternalAuth::PendingIdentityLink.build(lti_auth_hash, owner).persist!
  end

  before do
    Rails.cache.clear
    allow(Identities::HandleExternalAuth).to receive(:new)
      .and_return(instance_double(Identities::HandleExternalAuth, call: nil))
  end

  it "attaches the identity to the proven account, consumes the link, and returns it" do
    token = park(user)
    result = described_class.new(token, user).call

    expect(result).to be_success
    expect(result.value!).to include(user: user)
    expect(result.value![:auth_hash]["uid"]).to eq(uid)
    expect(user.reload.identities.where(provider: "lti", uid: uid)).to exist
    expect(ExternalAuth::PendingIdentityLink.find(token)).to be_nil
  end

  it "rejects a mismatched account, links nothing, and leaves the link intact" do
    token = park(user)
    result = described_class.new(token, other).call

    expect(result).to be_failure
    expect(result.failure).to eq(:ownership_mismatch)
    expect(Identity.where(uid: uid)).not_to exist
    expect(ExternalAuth::PendingIdentityLink.find(token)).to be_present
  end

  it "fails for an unknown or expired token" do
    result = described_class.new("missing", user).call

    expect(result).to be_failure
    expect(result.failure).to eq(:expired)
  end
end
