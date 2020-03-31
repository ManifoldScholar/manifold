require "rails_helper"

RSpec.describe ProjectChildAuthorizer do
  let!(:user) { FactoryBot.create :user, *user_traits }
  let!(:project) { FactoryBot.create :project, *project_traits }
  let!(:text) { FactoryBot.create :text, project: project }

  let(:draft) { false }
  let(:restricted_access) { false }
  let(:project_traits) do
    [].tap do |traits|
      traits << :as_draft if draft
      traits << :with_restricted_access if restricted_access
    end
  end

  let(:user_traits) do
    []
  end

  let(:project_child) { raise "must override in subcontexts" }

  subject { user }

  shared_examples_for "supports restricted access" do
    context "when the user tries to access a text belonging to a restricted project" do
      let(:restricted_access) { true }

      context "an admin" do
        let(:user_traits) { [:admin] }

        it { is_expected.to be_able_to(:read).on(project_child) }
      end

      context "a regular reader" do
        it { is_expected.to be_unable_to(:read).on(project_child) }
      end
    end
  end

  context "with a text section" do
    let!(:project_child) { FactoryBot.create :text_section, text: text }

    it_should_behave_like "supports restricted access"
  end
end
