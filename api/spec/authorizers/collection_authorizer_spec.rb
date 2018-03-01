require 'rails_helper'

RSpec.describe "Collection Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:collection) }

    the_subject_behaves_like "instance abilities", Collection, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:collection) }

    the_subject_behaves_like "instance abilities", Collection, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:collection) }

    the_subject_behaves_like "instance abilities", Collection, read_only: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:collection) }

    the_subject_behaves_like "instance abilities", Collection, all: true
  end

  context 'when the subject is a reader and project_editor of the collection\'s project' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @collection = FactoryBot.create(:collection)
      @maintainer.add_role Role::ROLE_PROJECT_EDITOR, @collection.project
    end
    let(:subject) { @maintainer }
    let(:object) { @collection }

    the_subject_behaves_like "instance abilities", Collection, all: true
  end

  context 'when the subject is a reader and project_resource_editor of the collection\'s project' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @collection = FactoryBot.create(:collection)
      @metadata_maintainer.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @collection.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @collection }

    the_subject_behaves_like "instance abilities", Collection, read_only: true
  end

  context 'when the subject is a reader and project_author of the collection\'s project' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @collection = FactoryBot.create(:collection)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @collection.project
    end
    let(:subject) { @author }
    let(:object) { @collection }

    the_subject_behaves_like "instance abilities", Collection, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:collection) }

    the_subject_behaves_like "instance abilities", Collection, read_only: true
  end
end
