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
end
