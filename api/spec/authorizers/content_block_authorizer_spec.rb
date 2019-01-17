require 'rails_helper'

RSpec.describe "Content Block Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, none: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, all: true
  end

  context 'when the subject is a reader and project_editor of the content block\'s project' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @content_block = FactoryBot.create(:content_block)
      @maintainer.add_role Role::ROLE_PROJECT_EDITOR, @content_block.project
    end
    let(:subject) { @maintainer }
    let(:object) { @content_block }

    the_subject_behaves_like "instance abilities", ContentBlock, all: true
  end

  context 'when the subject is a reader and project_resource_editor of the content block\'s project' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @content_block = FactoryBot.create(:content_block)
      @metadata_maintainer.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @content_block.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @content_block }

    the_subject_behaves_like "instance abilities", ContentBlock, none: true
  end

  context 'when the subject is a reader and project_author of a specific content_block' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @content_block = FactoryBot.create(:content_block)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @content_block.project
    end
    let(:subject) { @author }
    let(:object) { @content_block }

    the_subject_behaves_like "instance abilities", ContentBlock, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, none: true
  end

  context "when the block is a hero block" do
    let(:object) { FactoryBot.create(:hero_block) }

    context "when the subject is an admin" do
      let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN)}

      abilities = { read: true, create: true, update: true, delete: true }
      the_subject_behaves_like "instance abilities", ContentBlock, abilities
    end
  end
end
