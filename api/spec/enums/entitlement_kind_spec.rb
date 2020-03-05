require 'rails_helper'

RSpec.describe EntitlementKind do
  describe EntitlementKind::Subscription, enum: true do
    it { is_expected.to be_known }

    it { is_expected.to have_global_roles }
    it { is_expected.not_to have_scoped_roles }
  end

  describe EntitlementKind::Project, enum: true do
    it { is_expected.to be_known }

    it { is_expected.not_to have_global_roles }
    it { is_expected.to have_scoped_roles }
  end

  describe EntitlementKind::ProjectCollection, enum: true do
    it { is_expected.to be_known }

    it { is_expected.not_to have_global_roles }
    it { is_expected.to have_scoped_roles }
  end

  describe EntitlementKind::Unknown, enum: true do
    it { is_expected.not_to be_known }
    it { is_expected.not_to have_global_roles }
    it { is_expected.not_to have_scoped_roles }
  end
end
