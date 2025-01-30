# frozen_string_literal: true

RSpec.describe EntitlementAuthorizer, :authorizer do
  subject { entitlement }

  let_it_be(:project) { FactoryBot.create :project }

  let_it_be(:project_editor) { FactoryBot.create :user, edited_projects: [project] }

  let_it_be(:creator) { FactoryBot.create :user, :admin }
  let_it_be(:entitler) { FactoryBot.create :entitler, entity: creator }
  let_it_be(:target_user) { FactoryBot.create :user }
  let_it_be(:an_admin) { FactoryBot.create :user, :admin }
  let_it_be(:a_random_user) { FactoryBot.create :user }

  let(:entitlement_traits) { [:global_subscriber] }
  let(:entitlement_attributes) do
    {
      entitler: entitler,
      user: target_user
    }
  end

  let!(:entitlement) { FactoryBot.create :entitlement, *Array(entitlement_traits), **entitlement_attributes }

  context "with an admin" do
    subject { an_admin }

    it { is_expected.to be_able_to(:read, :manage, :delete).on(entitlement).and be_unable_to(:create, :update).on(entitlement) }
    it { is_expected.to be_able_to(:read, :create, :manage, :delete).on(Entitlement).and be_unable_to(:update).on(Entitlement) }
  end

  context "with a project editor" do
    subject { project_editor }

    it { is_expected.to be_unable_to(:read, :create, :manage, :update, :delete).on(entitlement) }
    it { is_expected.to be_unable_to(:read, :create, :manage, :update, :delete).on(Entitlement) }

    context "when for a specific project that the user has access to" do
      let(:entitlement_traits) { [:project_read_access] }
      let(:entitlement_attributes) { super().merge(subject: project) }

      it { is_expected.to be_able_to(:read, :create, :manage, :delete).on(entitlement).and be_unable_to(:update).on(entitlement) }
      it { is_expected.to be_able_to(:read, :create, :manage, :delete).on(Entitlement).with(for: project).and be_unable_to(:update).on(Entitlement).with(for: project) }
    end
  end

  context "with the entitler" do
    subject { creator }

    it { is_expected.to be_able_to(:read, :create, :manage, :delete).on(entitlement).and be_unable_to(:update).on(entitlement) }
    it { is_expected.to be_able_to(:read, :create, :manage, :delete).on(Entitlement).and be_unable_to(:update).on(Entitlement) }
  end

  context "with a random user" do
    subject { a_random_user }

    it { is_expected.to be_unable_to(:read, :create, :manage, :update, :delete).on(entitlement) }
    it { is_expected.to be_unable_to(:read, :create, :manage, :update, :delete).on(Entitlement) }
  end

  context "with the target user" do
    subject { target_user }

    it { is_expected.to be_able_to(:read).on(entitlement).and be_unable_to(:create, :manage, :update, :delete).on(entitlement) }
    it { is_expected.to be_able_to(:read).on(Entitlement).and be_unable_to(:create, :manage, :update, :delete).on(Entitlement) }
  end
end
