require 'rails_helper'

RSpec.describe SystemEntitlementKind do
  describe SystemEntitlementKind::Subscription, enum: true do
    it { is_expected.to be_known }
  end

  describe SystemEntitlementKind::Unknown, enum: true do
    it { is_expected.not_to be_known }
  end
end
