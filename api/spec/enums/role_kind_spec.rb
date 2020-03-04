require 'rails_helper'

RSpec.describe RoleKind do
  subject { described_class.new }

  describe RoleKind::Global, enum: true do
    it { is_expected.to be_global }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.not_to have_expected_resource }
  end

  describe RoleKind::Scoped, enum: true do
    it { is_expected.to be_scoped }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.to have_expected_resource }
  end

  describe RoleKind::GlobalEntitlement, enum: true do
    it { is_expected.to be_a_global_entitlement }
    it { is_expected.to be_an_entitlement }
    it { is_expected.not_to have_expected_resource }
  end

  describe RoleKind::ScopedEntitlement, enum: true do
    it { is_expected.to be_a_scoped_entitlement }
    it { is_expected.to be_an_entitlement }
    it { is_expected.to have_expected_resource }
  end

  describe RoleKind::Unknown, enum: true do
    it { is_expected.to be_unknown }
    it { is_expected.not_to be_valid }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.not_to have_expected_resource }
  end
end
