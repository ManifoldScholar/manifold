# frozen_string_literal: true

require "rails_helper"

RSpec.describe ExternalAuth::FindUser do
  let(:email) { "existing-#{SecureRandom.uuid}@example.com" }
  let!(:user) { FactoryBot.create(:user, email: email) }

  def auth_hash_for(provider:, uid:, email:, registration: nil)
    extra = { "raw_info" => { "email" => email }, "lti" => {} }
    extra["lti_registration"] = registration if registration

    OmniAuth::AuthHash.new(
      "provider" => provider,
      "uid" => uid,
      "info" => { "email" => email, "first_name" => "Pat", "last_name" => "Lee" },
      "extra" => extra
    )
  end

  def run(provider:, uid:, email:, registration: nil)
    described_class.run(
      provider: provider,
      auth_hash: auth_hash_for(provider: provider, uid: uid, email: email, registration: registration)
    )
  end

  context "LTI launch whose email matches an existing account (new subject)" do
    subject(:outcome) do
      run(provider: "lti", uid: "iss|new-sub", email: email,
          registration: FactoryBot.build(:lti_registration, require_account_linking: true))
    end

    it "requires linking and attaches no identity" do
      expect { outcome }.not_to change(Identity, :count)
      expect(outcome).to be_account_linking_required
      expect(outcome.user).to be_nil
      expect(outcome.linkable_user).to eq(user)
    end
  end

  context "LTI launch whose registration does not require linking" do
    subject(:outcome) do
      run(provider: "lti", uid: "iss|new-sub", email: email,
          registration: FactoryBot.build(:lti_registration, require_account_linking: false))
    end

    it "does not require linking even though the email matches" do
      expect(outcome).not_to be_account_linking_required
    end
  end

  context "LTI launch whose subject is already linked" do
    let!(:identity) { FactoryBot.create(:identity, user: user, provider: "lti", uid: "iss|known-sub") }

    subject(:outcome) do
      run(provider: "lti", uid: "iss|known-sub", email: email,
          registration: FactoryBot.build(:lti_registration, require_account_linking: true))
    end

    it "resolves to the linked user without requiring proof" do
      expect(outcome).not_to be_account_linking_required
      expect(outcome.user).to eq(user)
    end
  end

  context "LTI launch with no matching account" do
    subject(:outcome) do
      run(provider: "lti", uid: "iss|new-sub", email: "brand-new-#{SecureRandom.uuid}@example.com",
          registration: FactoryBot.build(:lti_registration, require_account_linking: true))
    end

    it "does not require linking (create path is unchanged)" do
      expect(outcome).not_to be_account_linking_required
    end
  end

  context "non-LTI provider whose config does not opt into linking" do
    subject(:outcome) { run(provider: "google_oauth2", uid: "g|new", email: email) }

    it "does not require linking" do
      expect(outcome).not_to be_account_linking_required
    end
  end

  context "non-LTI provider whose config opts into linking" do
    subject(:outcome) { run(provider: "google_oauth2", uid: "g|new", email: email) }

    before do
      provider_config = instance_double(AbstractOidcProviderConfig, require_account_linking?: true)
      allow(AuthConfig).to receive(:provider_for).with("google_oauth2").and_return(provider_config)
    end

    it "requires linking when the email matches an existing account" do
      expect(outcome).to be_account_linking_required
      expect(outcome.linkable_user).to eq(user)
    end
  end
end
