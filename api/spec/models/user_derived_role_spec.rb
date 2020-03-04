require "rails_helper"

RSpec.describe UserDerivedRole, type: :model do
  let(:user_trait) { nil }

  let!(:user) { FactoryBot.create :user, *Array(user_trait) }

  let!(:user_derived_role) { user.derived_role }

  subject { user_derived_role }

  context "for an admin" do
    let(:user_trait) { :admin }

    its(:role) { is_expected.to be_an_admin }
    its(:kind) { is_expected.to be_an_admin }
  end

  context "for an editor" do
    let(:user_trait) { :editor }

    its(:role) { is_expected.to be_an_editor }
    its(:kind) { is_expected.to be_an_editor }
  end

  context "for a project creator" do
    let(:user_trait) { :project_creator }

    its(:role) { is_expected.to be_a_project_creator }
    its(:kind) { is_expected.to be_a_project_creator }
  end

  context "for a marketeer" do
    let(:user_trait) { :marketeer }

    its(:role) { is_expected.to be_a_marketeer }
    its(:kind) { is_expected.to be_a_marketeer }
  end

  context "for a project author" do
    let!(:project) { FactoryBot.create :project }

    before do
      user.add_role :project_author, project

      user_derived_role.reload
    end

    its(:role) { is_expected.to be_a_reader }
    its(:kind) { is_expected.to be_a_project_author }
  end

  context "for a project editor" do
    let!(:project) { FactoryBot.create :project }

    before do
      user.add_role :project_editor, project

      user_derived_role.reload
    end

    its(:role) { is_expected.to be_a_reader }
    its(:kind) { is_expected.to be_a_project_editor }
  end

  context "for a reader" do
    let(:user_trait) { :reader }

    its(:role) { is_expected.to be_a_reader }
    its(:kind) { is_expected.to be_a_reader }
  end
end
