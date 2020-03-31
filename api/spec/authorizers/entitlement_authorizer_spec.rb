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

  context "an admin" do
    subject { an_admin }

    it { is_expected.to be_able_to(:read, :manage, :delete).on(entitlement).and be_unable_to(:create, :update).on(entitlement) }
    it { is_expected.to be_able_to(:read, :create, :manage, :delete).on(Entitlement).and be_unable_to(:update).on(Entitlement) }
  end

  context "the entitler" do
    subject { creator }

    it { is_expected.to be_able_to(:read, :create, :manage, :delete).on(entitlement).and be_unable_to(:update).on(entitlement) }
    it { is_expected.to be_able_to(:read, :create, :manage, :delete).on(Entitlement).and be_unable_to(:update).on(Entitlement) }
  end

  context "a random user" do
    subject { a_random_user }

    it { is_expected.to be_unable_to(:read, :create, :manage, :update, :delete).on(entitlement) }
    it { is_expected.to be_unable_to(:read, :create, :manage, :update, :delete).on(Entitlement) }
  end

  context "the target user" do
    subject { target_user }

    it { is_expected.to be_able_to(:read).on(entitlement).and be_unable_to(:create, :manage, :update, :delete).on(entitlement) }
    it { is_expected.to be_able_to(:read).on(Entitlement).and be_unable_to(:create, :manage, :update, :delete).on(Entitlement) }
  end
end
