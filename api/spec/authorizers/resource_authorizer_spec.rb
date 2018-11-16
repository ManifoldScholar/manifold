require 'rails_helper'

RSpec.describe "Resource Abilities", :authorizer do
  include_examples "unauthenticated user", Resource

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:resource) }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:resource) }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:resource) }

    the_subject_behaves_like "instance abilities", Resource, read_only: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:resource) }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context 'when the subject is a reader and project_editor of the resource\'s project' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @resource = FactoryBot.create(:resource)
      @maintainer.add_role Role::ROLE_PROJECT_EDITOR, @resource.project
    end
    let(:subject) { @maintainer }
    let(:object) { @resource }

    the_subject_behaves_like "instance abilities", Resource, all: true
  end

  context 'when the subject is a reader and project_resource_editor of the resource\'s project' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @resource = FactoryBot.create(:resource)
      @metadata_maintainer.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @resource.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @resource }

    abilities = { create: false, read: true, update: true, delete: false }
    the_subject_behaves_like "instance abilities", Resource, abilities
  end

  context 'when the subject is a reader and project_author of the resource\'s project' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @resource = FactoryBot.create(:resource)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @resource.project
    end
    let(:subject) { @author }
    let(:object) { @resource }

    the_subject_behaves_like "instance abilities", Resource, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:resource) }

    the_subject_behaves_like "instance abilities", Resource, read_only: true
  end
end
