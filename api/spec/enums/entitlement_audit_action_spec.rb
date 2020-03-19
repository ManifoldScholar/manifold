require 'rails_helper'

RSpec.describe EntitlementAuditAction do
  describe EntitlementAuditAction::AddRole, enum: true do
    it { is_expected.to be_change_role }
  end

  describe EntitlementAuditAction::RemoveRole, enum: true do
    it { is_expected.to be_change_role }
  end

  describe EntitlementAuditAction::Skip, enum: true do
    it { is_expected.not_to be_change_role }
  end
end
