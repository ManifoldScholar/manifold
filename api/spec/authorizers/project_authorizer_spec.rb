require 'rails_helper'

shared_examples_for "authorized to manage project children" do
  context "the subject's project child abilities" do
    it("the subject CAN manage project resources"){ expect(object.resources_manageable_by?(subject)).to be true }
    it("the subject CAN create project resources"){ expect(object.resources_creatable_by?(subject)).to be true }
    it("the subject CAN manage project collections"){ expect(object.collections_manageable_by?(subject)).to be true }
    it("the subject CAN create project collections"){ expect(object.collections_creatable_by?(subject)).to be true }
    it("the subject CAN manage project texts"){ expect(object.texts_manageable_by?(subject)).to be true }
    it("the subject CAN create project texts"){ expect(object.texts_creatable_by?(subject)).to be true }
    it("the subject CAN manage project twitter queries"){ expect(object.twitter_queries_manageable_by?(subject)).to be true }
    it("the subject CAN create project twitter queries"){ expect(object.twitter_queries_creatable_by?(subject)).to be true }
    it("the subject CAN manage project events"){ expect(object.events_manageable_by?(subject)).to be true }
    it("the subject CAN create project events"){ expect(object.events_creatable_by?(subject)).to be true }
    it("the subject CAN manage project makers"){ expect(object.makers_updatable_by?(subject)).to be true }
    it("the subject CAN read project log entries"){ expect(object.log_readable_by?(subject)).to be true }
  end
end

shared_examples_for "unauthorized to manage project children" do
  context "the subject's project child abilities" do
    it("the subject CAN'T manage project resources"){ expect(object.resources_manageable_by?(subject)).to be false }
    it("the subject CAN'T create project resources"){ expect(object.resources_creatable_by?(subject)).to be false }
    it("the subject CAN'T manage project collections"){ expect(object.collections_manageable_by?(subject)).to be false }
    it("the subject CAN'T create project collections"){ expect(object.collections_creatable_by?(subject)).to be false }
    it("the subject CAN'T manage project texts"){ expect(object.texts_manageable_by?(subject)).to be false }
    it("the subject CAN'T create project texts"){ expect(object.texts_creatable_by?(subject)).to be false }
    it("the subject CAN'T manage project twitter queries"){ expect(object.twitter_queries_manageable_by?(subject)).to be false }
    it("the subject CAN'T create project twitter queries"){ expect(object.twitter_queries_creatable_by?(subject)).to be false }
    it("the subject CAN'T manage project events"){ expect(object.events_manageable_by?(subject)).to be false }
    it("the subject CAN'T create project events"){ expect(object.events_creatable_by?(subject)).to be false }
    it("the subject CAN'T manage project makers"){ expect(object.makers_updatable_by?(subject)).to be false }
    it("the subject CAN'T read project log entries"){ expect(object.log_readable_by?(subject)).to be false }
  end
end


shared_examples_for "authorized to manage project permissions" do
  context "the subject's project permissions" do
    it("the subject CAN manage project permissions"){ expect(object.permissions_manageable_by?(subject)).to be true }
    it("the subject CAN create project permissions"){ expect(object.permissions_creatable_by?(subject)).to be true }
  end
end

shared_examples_for "unauthorized to manage project permissions" do
  context "the subject's project permissions" do
    it("the subject CAN'T manage project permissions"){ expect(object.permissions_manageable_by?(subject)).to be false }
    it("the subject CAN'T create project permissions"){ expect(object.permissions_creatable_by?(subject)).to be false }
  end
end

RSpec.describe "Project Abilities", :authorizer do
  context 'when the subject is an admin and the project is a draft' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    the_subject_behaves_like "instance abilities", Project, all: true
    the_subject_behaves_like "authorized to manage project children"
    the_subject_behaves_like "authorized to manage project permissions"
  end

  context 'when the subject is an editor and the project is a draft' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    the_subject_behaves_like "instance abilities", Project, all: true
    the_subject_behaves_like "authorized to manage project children"
    the_subject_behaves_like "authorized to manage project permissions"
  end

  context 'when the subject is a project_creator and the project is a draft' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    abilities = { create: true, read: false, update: false, delete: false }
    the_subject_behaves_like "instance abilities", Project, abilities
    the_subject_behaves_like "unauthorized to manage project children"
    the_subject_behaves_like "unauthorized to manage project permissions"
  end

  context 'when the subject is a marketeer and the project is a draft' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    abilities = { create: false, read: true, update: true, delete: false }
    the_subject_behaves_like "instance abilities", Project, abilities
    the_subject_behaves_like "authorized to manage project children"
    the_subject_behaves_like "unauthorized to manage project permissions"
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
    the_subject_behaves_like "authorized to manage project children"
    the_subject_behaves_like "authorized to manage project permissions"
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
    context "the subject's project child abilities" do
      it("the subject CAN manage project resources"){ expect(object.resources_manageable_by?(subject)).to be true }
      it("the subject CAN'T create project resources"){ expect(object.resources_creatable_by?(subject)).to be false }
      it("the subject CAN'T manage project collections"){ expect(object.collections_manageable_by?(subject)).to be false }
      it("the subject CAN'T create project collections"){ expect(object.collections_creatable_by?(subject)).to be false }
      it("the subject CAN'T manage project texts"){ expect(object.texts_manageable_by?(subject)).to be false }
      it("the subject CAN'T create project texts"){ expect(object.texts_creatable_by?(subject)).to be false }
      it("the subject CAN'T manage project twitter queries"){ expect(object.twitter_queries_manageable_by?(subject)).to be false }
      it("the subject CAN'T create project twitter queries"){ expect(object.twitter_queries_creatable_by?(subject)).to be false }
      it("the subject CAN'T manage project events"){ expect(object.events_manageable_by?(subject)).to be false }
      it("the subject CAN'T create project events"){ expect(object.events_creatable_by?(subject)).to be false }
      it("the subject CAN'T manage project makers"){ expect(object.makers_updatable_by?(subject)).to be false }
      it("the subject CAN'T read project log entries"){ expect(object.log_readable_by?(subject)).to be false }
    end
    the_subject_behaves_like "unauthorized to manage project permissions"
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
    the_subject_behaves_like "unauthorized to manage project children"
    the_subject_behaves_like "unauthorized to manage project permissions"
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
    the_subject_behaves_like "unauthorized to manage project children"
    the_subject_behaves_like "unauthorized to manage project permissions"
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:project, draft: false) }

    the_subject_behaves_like "instance abilities", Project, read_only: true
    the_subject_behaves_like "unauthorized to manage project children"
    the_subject_behaves_like "unauthorized to manage project permissions"
  end

  context 'when the subject is a reader and the project is a draft' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:project, draft: true) }

    the_subject_behaves_like "instance abilities", Project, none: true
    the_subject_behaves_like "unauthorized to manage project children"
    the_subject_behaves_like "unauthorized to manage project permissions"
  end
  
end
