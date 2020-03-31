require 'rails_helper'

RSpec.describe "Text Abilities", :authorizer do
  include_examples "unauthenticated user", Text

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }
    let(:object) { FactoryBot.create(:text) }

    the_subject_behaves_like "instance abilities", Text, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }
    let(:object) { FactoryBot.create(:text) }

    the_subject_behaves_like "instance abilities", Text, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, :project_creator) }
    let(:object) { FactoryBot.create(:text) }

    the_subject_behaves_like "instance abilities", Text, read_only: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, :marketeer) }
    let(:object) { FactoryBot.create(:text) }

    the_subject_behaves_like "instance abilities", Text, all: true
  end

  context "when the subject is a reader and project_editor of the text's project" do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @text = FactoryBot.create(:text)
      @maintainer.add_role :project_editor, @text.project
    end
    let(:subject) { @maintainer }
    let(:object) { @text }

    the_subject_behaves_like "instance abilities", Text, all: true
  end

  context "when the subject is a reader and project_resource_editor of the text's project" do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @text = FactoryBot.create(:text)
      @metadata_maintainer.add_role :project_resource_editor, @text.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @text }

    abilities = { create: false, read: true, update: false, delete: false }
    the_subject_behaves_like "instance abilities", Text, abilities
  end

  context "when the subject is a reader and project_author of the text's project" do
    before(:each) do
      @author = FactoryBot.create(:user)
      @text = FactoryBot.create(:text)
      @author.add_role :project_author, @text.project
    end
    let(:subject) { @author }
    let(:object) { @text }

    the_subject_behaves_like "instance abilities", Text, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:text) }

    the_subject_behaves_like "instance abilities", Text, read_only: true
  end

  context "when the user tries to access a text belonging to a restricted project" do
    let!(:project) { FactoryBot.create :project, :with_restricted_access }
    let!(:text)    { FactoryBot.create :text, project: project }
    let!(:user)    { FactoryBot.create :user }

    subject { user }

    context "an admin" do
      let!(:user) { FactoryBot.create :user, :admin }

      it { is_expected.to be_able_to(:read).on(text) }
    end

    context "a regular reader" do
      it { is_expected.to be_unable_to(:read).on(text) }
    end
  end
end
