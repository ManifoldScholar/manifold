require "rails_helper"

RSpec.describe "Journal Abilities", :authorizer do
  include TestHelpers::AuthorizationHelpers

  let(:journal_traits) do
    []
  end
  let(:user_traits) do
    []
  end

  let!(:user) { FactoryBot.create :user, *user_traits }
  let!(:journal) { FactoryBot.create :journal, *journal_traits}
  let!(:journal_issue) { FactoryBot.create :journal_issue, journal: journal }

  subject { user }

  shared_examples_for "no access" do
    it { is_expected.to be_unable_to(:read, :create, :update, :destroy).on(journal) }

    include_examples "unauthorized to manage journal permissions"
    include_examples "unauthorized to manage journal entitlements"
    include_examples "unauthorized to manage journal issues"
  end

  shared_examples_for "full access" do
    it("can perform all CRUD actions") { is_expected.to be_able_to(:create, :read, :update, :destroy).on(journal) }

    include_examples "authorized to manage journal permissions"
    include_examples "authorized to manage journal entitlements"
    include_examples "authorized to manage journal issues"
  end

  shared_examples_for "not admin" do
    include_examples "unauthorized to manage journal permissions"
    include_examples "unauthorized to manage journal entitlements"
  end

  shared_examples_for "read only" do
    it { is_expected.to be_able_to(:read).on(journal).and be_unable_to(:create, :update, :destroy).on(journal)}

    include_examples "unauthorized to manage journal permissions"
    include_examples "unauthorized to manage journal entitlements"
    include_examples "unauthorized to manage journal issues"
  end

  shared_examples_for "read access" do
    it { is_expected.to be_able_to(:read).on(journal)}
  end

  shared_examples_for "edit access" do
    it { is_expected.to be_able_to(:update).on(journal)}
  end

  shared_examples_for "delete access" do
    it { is_expected.to be_able_to(:delete).on(journal)}
  end

  shared_examples_for "authorized to manage journal entitlements" do
    it "can manage journal entitlements" do
      is_expected.to be_able_to(:manage_entitlements, :create_entitlements).on(journal)
    end
  end

  shared_examples_for "authorized to manage journal permissions" do
    it "is able to manage journal permissions" do
      is_expected.to be_able_to(:manage_permissions, :create_permissions).on(journal)
    end
  end

  shared_examples_for "authorized to manage journal issues" do
    it "is able to manage journal issues in full" do
      is_expected.to be_able_to(
        :manage_permissions,
        :create_permissions,
        :create,
        :read,
        :update,
        :destroy
      ).on(journal_issue)

    end
  end

  shared_examples_for "unauthorized to manage journal issues" do
   it "is unable to manage journal issues" do
      is_expected.to be_unable_to(
        :manage_permissions,
        :create_permissions,
        :create,
        :read,
        :update,
        :destroy
      ).on(journal_issue)
    end
  end

  shared_examples_for "unauthorized to create new journals" do
    it { is_expected.to be_unable_to(:create).on(journal)}
  end

  shared_examples_for "unauthorized to delete journals" do
    it { is_expected.to be_unable_to(:delete).on(journal)}
  end

  shared_examples_for "unauthorized to manage journal entitlements" do
    it "cannot manage journal entitlements" do
      is_expected.to be_unable_to(:manage_entitlements, :create_entitlements).on(journal)
    end
  end

  shared_examples_for "unauthorized to manage journal permissions" do
    it "cannot manage journal permissions" do
      is_expected.not_to be_able_to(:manage_permissions, :create_permissions).on(journal)
    end
  end

  context "when unauthenticated" do
    let(:user) { anonymous_user }

    include_examples "no access"
  end

  context "when the user is a regular reader" do
    include_examples "read only"
  end

  context "when the user is an editor" do
    let(:user_traits) { [:editor] }

    include_examples "full access"
  end

  context "when the user is an admin" do
    let(:user_traits) { [:admin] }

    include_examples "full access"
  end

  context "when the user is a project editor" do
    before do
      user.add_role :project_editor, journal
    end

    include_examples "authorized to manage journal issues"
    include_examples "unauthorized to create new journals"
    include_examples "not admin"
    include_examples "read access"
    include_examples "edit access"
    include_examples "delete access"
  end

  context "when the user is a journal editor" do
    before do
      user.add_role :journal_editor, journal
    end

    include_examples "authorized to manage journal issues"

    include_examples "unauthorized to create new journals"
    include_examples "unauthorized to delete journals"
    include_examples "not admin"
    include_examples "read access"
    include_examples "edit access"
  end

end
