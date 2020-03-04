require 'rails_helper'

RSpec.describe "Maker Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }
    let(:object) { FactoryBot.create(:maker) }

    the_subject_behaves_like "instance abilities", Maker, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }
    let(:object) { FactoryBot.create(:maker) }

    the_subject_behaves_like "instance abilities", Maker, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, :project_creator) }
    let(:object) { FactoryBot.create(:maker) }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, :marketeer) }
    let(:object) { FactoryBot.create(:maker) }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end

  context "when the subject is a reader and project_editor of a maker's project" do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      collaborator = FactoryBot.create(:collaborator)
      @maker = collaborator.maker
      @maintainer.add_role :project_editor, collaborator.collaboratable
    end
    let(:subject) { @maintainer }
    let(:object) { @maker }

    the_subject_behaves_like "instance abilities", Maker, all: true
  end

  context "when the subject is a reader and project_editor, but not of the maker's project" do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      collaborator = FactoryBot.create(:collaborator)
      project = FactoryBot.create(:project)
      @maker = collaborator.maker
      @maintainer.add_role :project_editor, project
    end
    let(:subject) { @maintainer }
    let(:object) { @maker }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end

  context "when the subject is a reader and project_resource_editor of a maker's project" do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      collaborator = FactoryBot.create(:collaborator)
      @maker = collaborator.maker
      @metadata_maintainer.add_role :project_resource_editor, collaborator.collaboratable
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @maker }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end

  context "when the subject is a reader and project_author of a maker's project" do
    before(:each) do
      @author = FactoryBot.create(:user)
      collaborator = FactoryBot.create(:collaborator)
      @maker = collaborator.maker
      @author.add_role :project_author, collaborator.collaboratable
    end
    let(:subject) { @author }
    let(:object) { @maker }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:maker) }

    the_subject_behaves_like "instance abilities", Maker, none: true
  end
end
