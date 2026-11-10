# frozen_string_literal: true

require "rails_helper"

RSpec.describe ExternalAuth::FindUser do
  let(:email) { "existing-#{SecureRandom.uuid}@example.com" }
  let!(:user) { FactoryBot.create(:user, email: email) }

  def auth_hash_for(provider:, uid:, email:)
    OmniAuth::AuthHash.new(
      "provider" => provider,
      "uid" => uid,
      "info" => { "email" => email, "first_name" => "Pat", "last_name" => "Lee" },
      "extra" => { "raw_info" => { "email" => email }, "lti" => {} }
    )
  end

  def run(provider:, uid:, email:)
    described_class.run(provider: provider, auth_hash: auth_hash_for(provider: provider, uid: uid, email: email))
  end

  context "LTI launch whose email matches an existing account (new subject)" do
    subject(:outcome) { run(provider: "lti", uid: "iss|new-sub", email: email) }

    it "requires link confirmation and attaches no identity" do
      expect { outcome }.not_to change(Identity, :count)
      expect(outcome).to be_requires_link
      expect(outcome.user).to be_nil
      expect(outcome.linkable_user).to eq(user)
    end
  end

  context "LTI launch whose subject is already linked" do
    let!(:identity) { FactoryBot.create(:identity, user: user, provider: "lti", uid: "iss|known-sub") }

    subject(:outcome) { run(provider: "lti", uid: "iss|known-sub", email: email) }

    it "resolves to the linked user without requiring proof" do
      expect(outcome).not_to be_requires_link
      expect(outcome.user).to eq(user)
    end
  end

  context "LTI launch with no matching account" do
    subject(:outcome) { run(provider: "lti", uid: "iss|new-sub", email: "brand-new-#{SecureRandom.uuid}@example.com") }

    it "does not require link confirmation (create path is unchanged)" do
      expect(outcome).not_to be_requires_link
    end
  end

  context "non-LTI provider whose email matches an existing account" do
    subject(:outcome) { run(provider: "google_oauth2", uid: "g|new", email: email) }

    it "does not require link confirmation (policy excludes it)" do
      expect(outcome).not_to be_requires_link
    end
  end
end
