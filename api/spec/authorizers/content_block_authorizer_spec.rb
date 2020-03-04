require 'rails_helper'

RSpec.describe "Content Block Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, :project_creator) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, read_only: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, :marketeer) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, all: true
  end

  context 'when the subject is a reader and project_editor of the content block\'s project' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @content_block = FactoryBot.create(:content_block)
      @maintainer.add_role :project_editor, @content_block.project
    end
    let(:subject) { @maintainer }
    let(:object) { @content_block }

    the_subject_behaves_like "instance abilities", ContentBlock, all: true
  end

  context 'when the subject is a reader and project_resource_editor of the content block\'s project' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @content_block = FactoryBot.create(:content_block)
      @metadata_maintainer.add_role :project_resource_editor, @content_block.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @content_block }

    the_subject_behaves_like "instance abilities", ContentBlock, read_only: true
  end

  context 'when the subject is a reader and project_author of a specific content_block' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @content_block = FactoryBot.create(:content_block)
      @author.add_role :project_author, @content_block.project
    end
    let(:subject) { @author }
    let(:object) { @content_block }

    the_subject_behaves_like "instance abilities", ContentBlock, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:content_block) }

    the_subject_behaves_like "instance abilities", ContentBlock, read_only: true
  end
end
