require 'rails_helper'

RSpec.describe "Category Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }
    let(:object) { FactoryBot.create(:category) }

    the_subject_behaves_like "instance abilities", Category, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }
    let(:object) { FactoryBot.create(:category) }

    the_subject_behaves_like "instance abilities", Category, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, :project_creator) }
    let(:object) { FactoryBot.create(:category) }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, :marketeer) }
    let(:object) { FactoryBot.create(:category) }

    the_subject_behaves_like "instance abilities", Category, all: true
  end

  context "when the subject is a reader and project_editor of the category's project" do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @category = FactoryBot.create(:category)
      @maintainer.add_role :project_editor, @category.project
    end
    let(:subject) { @maintainer }
    let(:object) { @category }

    the_subject_behaves_like "instance abilities", Category, all: true
  end

  context 'when the subject is a reader and project_editor of a different project' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @category = FactoryBot.create(:category)
      @maintainer.add_role :project_editor, FactoryBot.create(:project)
    end
    let(:subject) { @maintainer }
    let(:object) { @category }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end

  context 'when the subject is a reader and project_resource_editor of the category\'s project' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @category = FactoryBot.create(:category)
      @metadata_maintainer.add_role :project_resource_editor, @category.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @category }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end

  context 'when the subject is a reader and project_author of a specific category' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @category = FactoryBot.create(:category)
      @author.add_role :project_author, @category.project
    end
    let(:subject) { @author }
    let(:object) { @category }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:category) }

    the_subject_behaves_like "instance abilities", Category, read_only: true
  end
end
