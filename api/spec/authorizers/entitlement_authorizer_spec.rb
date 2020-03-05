require "rails_helper"

RSpec.describe EntitlementAuthorizer, :authorizer do
  subject { entitlement }

  let!(:creator) { FactoryBot.create :user, :admin }
  let!(:entitler) { FactoryBot.create :entitler, entity: creator }
  let!(:target_user) { FactoryBot.create :user }
  let(:an_admin) { FactoryBot.create :user, :admin }
  let(:a_random_user) { FactoryBot.create :user }

  let(:entitlement_traits) { [:global_subscriber] }
  let(:entitlement_attributes) do
    {
      entitler: entitler,
      user: target_user
    }
  end

  let!(:entitlement) { FactoryBot.create :entitlement, *Array(entitlement_traits), **entitlement_attributes }

  context "at the instance level" do
    subject { entitlement }

    it { is_expected.to be_readable_by a_random_user }
    it { is_expected.to be_creatable_by creator }
    it { is_expected.not_to be_creatable_by an_admin }
    it { is_expected.to be_updatable_by creator }
    it { is_expected.not_to be_updatable_by an_admin }

    it "is deletable only by the entitler or an admin" do
      aggregate_failures do
        is_expected.to be_deletable_by an_admin
        is_expected.to be_deletable_by creator
        is_expected.not_to be_deletable_by a_random_user
      end
    end
  end

  context "at the class level" do
    subject { Entitlement }
    it { is_expected.to be_readable_by a_random_user }

    it { is_expected.to be_creatable_by creator }
    it { is_expected.to be_creatable_by an_admin }
    it { is_expected.not_to be_creatable_by a_random_user }
    it { is_expected.to be_updatable_by creator }
    it { is_expected.to be_updatable_by an_admin }
    it { is_expected.not_to be_creatable_by a_random_user }

    it "is deletable only by the entitler or an admin" do
      aggregate_failures do
        is_expected.to be_deletable_by an_admin
        is_expected.to be_deletable_by creator
        is_expected.not_to be_deletable_by a_random_user
      end
    end
  end
end
