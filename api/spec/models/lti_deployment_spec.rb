# frozen_string_literal: true

require "rails_helper"

RSpec.describe LtiDeployment, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:lti_deployment)).to be_valid
  end

  describe "validations" do
    let(:deployment) { FactoryBot.build(:lti_deployment, deployment_id: nil) }

    it "is invalid without a deployment_id" do
      expect(deployment).not_to be_valid
    end
  end

  describe "uniqueness" do
    let(:registration) { FactoryBot.create(:lti_registration) }
    let!(:existing) { FactoryBot.create(:lti_deployment, lti_registration: registration, deployment_id: "dep_1") }
    let(:duplicate) { FactoryBot.build(:lti_deployment, lti_registration: registration, deployment_id: "dep_1") }
    let(:other) { FactoryBot.build(:lti_deployment, deployment_id: "dep_1") }

    it "enforces uniqueness of deployment_id scoped to registration" do
      expect(duplicate).not_to be_valid
    end

    it "allows the same deployment_id for different registrations" do
      expect(other).to be_valid
    end
  end
end
