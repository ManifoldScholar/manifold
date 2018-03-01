require 'rails_helper'

RSpec.describe "Project Abilities", :authorizer do
  context 'when the subject is an admin and the project is a draft' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    the_subject_behaves_like "instance abilities", Project, all: true
  end

  context 'when the subject is an editor and the project is a draft' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    the_subject_behaves_like "instance abilities", Project, all: true
  end

  context 'when the subject is a project_creator and the project is a draft' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    abilities = { create: true, read: false, update: false, delete: false }
    the_subject_behaves_like "instance abilities", Project, abilities
  end

  context 'when the subject is a marketeer and the project is a draft' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    abilities = { create: false, read: true, update: true, delete: false }
    the_subject_behaves_like "instance abilities", Project, abilities
  end

  context 'when the subject is a reader and project_editor of a draft project' do
    before(:each) do
      @project_editor = FactoryBot.create(:user)
      @project = FactoryBot.create(:project, draft: true)
      @project_editor.add_role Role::ROLE_PROJECT_EDITOR, @project
    end
    let(:subject) { @project_editor }
    let(:object) { @project }

    abilities = { create: false, read: true, update: true, delete: true }
    the_subject_behaves_like "instance abilities", Project, abilities
  end

  context 'when the subject is a reader and project_resource_editor of the project' do
    before(:each) do
      @metadata_editor = FactoryBot.create(:user)
      @project = FactoryBot.create(:project, draft: true)
      @metadata_editor.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @project
    end
    let(:subject) { @metadata_editor }
    let(:object) { @project }

    the_subject_behaves_like "instance abilities", Project, read_only: true
  end

  context 'when the subject is a reader and project_author of the project' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @project = FactoryBot.create(:project, draft: false)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @project
    end
    let(:subject) { @author }
    let(:object) { @project }

    the_subject_behaves_like "instance abilities", Project, read_only: true
  end

  context 'when the subject is a reader and project_author of a draft project' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @project = FactoryBot.create(:project, draft: true)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @project
    end
    let(:subject) { @author }
    let(:object) { @project }

    the_subject_behaves_like "instance abilities", Project, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:project, draft: false) }

    the_subject_behaves_like "instance abilities", Project, read_only: true
  end

  context 'when the subject is a reader and the project is a draft' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    the_subject_behaves_like "instance abilities", Project, none: true
  end


end
