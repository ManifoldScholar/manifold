require 'rails_helper'

RSpec.describe "ResourceResourceCollection Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }
    let(:object) { FactoryBot.create(:resource_collection) }

    the_subject_behaves_like "instance abilities", ResourceCollection, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }
    let(:object) { FactoryBot.create(:resource_collection) }

    the_subject_behaves_like "instance abilities", ResourceCollection, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, :project_creator) }
    let(:object) { FactoryBot.create(:resource_collection) }

    the_subject_behaves_like "instance abilities", ResourceCollection, read_only: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, :marketeer) }
    let(:object) { FactoryBot.create(:resource_collection) }

    the_subject_behaves_like "instance abilities", ResourceCollection, all: true
  end

  context "when the subject is a reader and project_editor of the collection's project" do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @collection = FactoryBot.create(:resource_collection)
      @maintainer.add_role :project_editor, @collection.project
    end
    let(:subject) { @maintainer }
    let(:object) { @collection }

    the_subject_behaves_like "instance abilities", ResourceCollection, all: true
  end

  context "when the subject is a reader and project_resource_editor of the collection's project" do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @collection = FactoryBot.create(:resource_collection)
      @metadata_maintainer.add_role :project_resource_editor, @collection.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @collection }

    the_subject_behaves_like "instance abilities", ResourceCollection, read_only: true
  end

  context "when the subject is a reader and project_author of the collection's project" do
    before(:each) do
      @author = FactoryBot.create(:user)
      @collection = FactoryBot.create(:resource_collection)
      @author.add_role :project_author, @collection.project
    end
    let(:subject) { @author }
    let(:object) { @collection }

    the_subject_behaves_like "instance abilities", ResourceCollection, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:resource_collection) }

    the_subject_behaves_like "instance abilities", ResourceCollection, read_only: true
  end
end
