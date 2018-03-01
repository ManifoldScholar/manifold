require 'rails_helper'

RSpec.describe "Twitter Query Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
    let(:object) { FactoryBot.create(:twitter_query) }

    the_subject_behaves_like "instance abilities", TwitterQuery, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:object) { FactoryBot.create(:twitter_query) }

    the_subject_behaves_like "instance abilities", TwitterQuery, all: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_PROJECT_CREATOR) }
    let(:object) { FactoryBot.create(:twitter_query) }

    the_subject_behaves_like "instance abilities", TwitterQuery, none: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }
    let(:object) { FactoryBot.create(:twitter_query) }

    abilities = { create: true, read: true, update: true, delete: false }
    the_subject_behaves_like "instance abilities", TwitterQuery, all: true
  end

  context 'when the subject is a reader and project_editor of the twitter query\'s project' do
    before(:each) do
      @maintainer = FactoryBot.create(:user)
      @twitter_query = FactoryBot.create(:twitter_query)
      @maintainer.add_role Role::ROLE_PROJECT_EDITOR, @twitter_query.project
    end
    let(:subject) { @maintainer }
    let(:object) { @twitter_query }

    the_subject_behaves_like "instance abilities", TwitterQuery, all: true
  end

  context 'when the subject is a reader and project_resource_editor of the twitter query\'s project' do
    before(:each) do
      @metadata_maintainer = FactoryBot.create(:user)
      @twitter_query = FactoryBot.create(:twitter_query)
      @metadata_maintainer.add_role Role::ROLE_PROJECT_RESOURCE_EDITOR, @twitter_query.project
    end
    let(:subject) { @metadata_maintainer }
    let(:object) { @twitter_query }

    the_subject_behaves_like "instance abilities", TwitterQuery, none: true
  end

  context 'when the subject is a reader and project_author of a specific twitter_query' do
    before(:each) do
      @author = FactoryBot.create(:user)
      @twitter_query = FactoryBot.create(:twitter_query)
      @author.add_role Role::ROLE_PROJECT_AUTHOR, @twitter_query.project
    end
    let(:subject) { @author }
    let(:object) { @twitter_query }

    the_subject_behaves_like "instance abilities", TwitterQuery, none: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:twitter_query) }

    the_subject_behaves_like "instance abilities", TwitterQuery, none: true
  end
end
