require 'rails_helper'

RSpec.describe EntitlementState do
  let!(:expiring_soon) { instance_double(Entitlement, :should_be_expiring_soon? => true, :has_expired? => false) }
  let!(:expired) { instance_double(Entitlement, :should_be_expiring_soon? => false, :has_expired? => true) }
  let!(:active) { instance_double(Entitlement, :should_be_expiring_soon? => false, :has_expired? => false)}

  describe EntitlementState::Pending, enum: true do
    it { is_expected.not_to be_applicable_for expiring_soon }
    it { is_expected.not_to be_applicable_for expired }
    it { is_expected.not_to be_applicable_for active }
  end

  describe EntitlementState::ExpiringSoon, enum: true do
    it { is_expected.to be_applicable_for expiring_soon }
    it { is_expected.not_to be_applicable_for expired }
    it { is_expected.not_to be_applicable_for active }
  end

  describe EntitlementState::Expired, enum: true do
    it { is_expected.not_to be_applicable_for expiring_soon }
    it { is_expected.to be_applicable_for expired }
    it { is_expected.not_to be_applicable_for active }
  end

  describe EntitlementState::Active, enum: true do
    it { is_expected.not_to be_applicable_for expiring_soon }
    it { is_expected.not_to be_applicable_for expired }
    it { is_expected.to be_applicable_for active }
  end
end
