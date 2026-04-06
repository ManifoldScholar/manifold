# frozen_string_literal: true

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
  let!(:journal) { FactoryBot.create :journal, *journal_traits }
  let!(:journal_issue) { FactoryBot.create :journal_issue, journal: journal }

  subject { user }

  shared_examples_for "no access" do
    it { is_expected.to be_unable_to(:read, :create, :update, :delete).on(journal) }

    it_behaves_like "unauthorized to manage journal permissions"
    it_behaves_like "unauthorized to manage journal entitlements"
    it_behaves_like "unauthorized to manage journal issues"
    it_behaves_like "unauthorized to manage journal issue projects"
  end

  shared_examples_for "full access" do
    it("can perform all CRUD actions") { is_expected.to be_able_to(:create, :read, :update, :delete).on(journal) }

    it_behaves_like "authorized to manage journal permissions"
    it_behaves_like "authorized to manage journal entitlements"
    it_behaves_like "authorized to manage journal issues"
  end

  shared_examples_for "not admin" do
    it_behaves_like "unauthorized to manage journal permissions"
    it_behaves_like "unauthorized to manage journal entitlements"
  end

  shared_examples_for "read only" do
    it { is_expected.to be_able_to(:read).on(journal).and be_unable_to(:create, :update, :delete).on(journal) }

    it_behaves_like "unauthorized to manage journal permissions"
    it_behaves_like "unauthorized to manage journal entitlements"
    it_behaves_like "unauthorized to manage journal issues"
    it_behaves_like "unauthorized to manage journal issue projects"
  end

  shared_examples_for "read access" do
    it { is_expected.to be_able_to(:read).on(journal) }
  end

  shared_examples_for "edit access" do
    it { is_expected.to be_able_to(:update).on(journal) }
  end

  shared_examples_for "delete access" do
    it { is_expected.to be_able_to(:delete).on(journal) }
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
        :delete
      ).on(journal_issue)
    end
  end

  shared_examples_for "unauthorized to manage journal issues" do
    it "is unable to manage journal issues" do
      is_expected.to be_able_to(:read).on(journal_issue).and(be_unable_to(
        :manage_permissions,
        :create_permissions,
        :create,
        :update,
        :delete
      ).on(journal_issue))
    end
  end

  shared_examples_for "authorized to manage journal issue projects" do
    it "is not able to create journal issue projects directly" do
      is_expected.not_to be_able_to(:create).on(journal_issue.project)
    end

    it "is able to read journal issue projects" do
      is_expected.to be_able_to(:read).on(journal_issue.project)
    end

    it "is able to update journal issue projects" do
      is_expected.to be_able_to(:update).on(journal_issue.project)
    end

    it "cannot delete a journal issue's project directly (delete the journal issue itself)" do
      is_expected.not_to be_able_to(:delete).on(journal_issue.project)
    end
  end

  shared_examples_for "unauthorized to manage journal issue projects" do
    it "is unable to manage journal issue projects" do
      is_expected.to be_unable_to(
        :manage_permissions,
        :create_permissions,
        :create,
        :update,
        :delete
      ).on(journal_issue.project)
    end
  end

  shared_examples_for "unauthorized to create new journals" do
    it { is_expected.to be_unable_to(:create).on(journal) }
  end

  shared_examples_for "unauthorized to delete journals" do
    it { is_expected.to be_unable_to(:delete).on(journal) }
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

    it_behaves_like "read only"
  end

  context "when the user is a regular reader" do
    it_behaves_like "read only"
  end

  context "when the user is an editor" do
    let(:user_traits) { [:editor] }

    it_behaves_like "full access"
  end

  context "when the user is an admin" do
    let(:user_traits) { [:admin] }

    it_behaves_like "full access"
  end

  context "when the user is a project editor" do
    before do
      user.add_role :project_editor, journal
      user.remove_role :reader
    end

    it_behaves_like "authorized to manage journal issues"
    it_behaves_like "unauthorized to create new journals"
    it_behaves_like "not admin"
    it_behaves_like "read access"
    it_behaves_like "edit access"
    it_behaves_like "delete access"
  end

  context "when the user is a journal editor" do
    before do
      user.add_role :journal_editor, journal
      user.remove_role :reader
    end

    it_behaves_like "authorized to manage journal issues"
    it_behaves_like "authorized to manage journal issue projects"
    it_behaves_like "unauthorized to delete journals"
    it_behaves_like "not admin"
    it_behaves_like "read access"
    it_behaves_like "edit access"

    context "when the journal issue is a draft" do
      let!(:journal_issue) { FactoryBot.create :draft_journal_issue, journal: journal }

      it_behaves_like "authorized to manage journal issues"
      it_behaves_like "authorized to manage journal issue projects"
    end
  end
end
