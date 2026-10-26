# frozen_string_literal: true

require "rails_helper"

RSpec.describe LtiRegistration, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:lti_registration)).to be_valid
  end

  describe "validations" do
    let(:registration) { FactoryBot.build(:lti_registration, issuer: nil) }

    it "is invalid without an issuer" do
      expect(registration).not_to be_valid
    end
  end

  describe "uniqueness" do
    let!(:existing) { FactoryBot.create(:lti_registration, issuer: "https://example.com", client_id: "abc") }
    let(:duplicate) { FactoryBot.build(:lti_registration, issuer: "https://example.com", client_id: "abc") }
    let(:different_issuer) { FactoryBot.build(:lti_registration, issuer: "https://other.example.com", client_id: "abc") }

    it "enforces uniqueness of client_id scoped to issuer" do
      expect(duplicate).not_to be_valid
    end

    it "allows the same client_id for different issuers" do
      expect(different_issuer).to be_valid
    end
  end

  describe "dependent destroy" do
    let!(:registration) { FactoryBot.create(:lti_registration, :with_deployment) }

    it "destroys associated deployments" do
      expect { registration.destroy }.to change(LtiDeployment, :count).by(-1)
    end
  end

  describe "state machine" do
    let(:registration) { FactoryBot.create(:lti_registration, :pending) }

    it "starts pending" do
      expect(registration).to be_pending
    end

    it "transitions pending to approved" do
      expect { registration.transition_to!(:approved) }.to change(registration, :approved?).from(false).to(true)
    end

    it "rejects an undefined transition" do
      registration.transition_to!(:approved)

      expect { registration.transition_to!(:pending) }.to raise_error(Statesman::TransitionFailedError)
    end

    it "scopes to approved registrations" do
      approved = FactoryBot.create(:lti_registration, :approved)

      expect(described_class.approved).to contain_exactly(approved)
    end

    it "allows an admin to override a denial" do
      registration.transition_to!(:denied)

      expect { registration.transition_to!(:approved) }.to change(registration, :approved?).from(false).to(true)
    end
  end
end
