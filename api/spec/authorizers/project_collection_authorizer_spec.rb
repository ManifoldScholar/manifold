require 'rails_helper'

RSpec.describe "ProjectCollection Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }

    the_subject_behaves_like "class abilities", ProjectCollection, all: true
  end

  context 'when the subject is a reader of a visible project collection' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:project_collection, visible: true )}

    the_subject_behaves_like "instance abilities", ProjectCollection, read_only: true
  end

  context 'when the subject is a reader of a not visible project collection' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:project_collection, visible: false )}

    the_subject_behaves_like "instance abilities", ProjectCollection, none: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, :marketeer) }
    let(:object) { FactoryBot.create(:project_collection) }

    the_subject_behaves_like "class abilities", ProjectCollection, all: true
  end

  context 'when the subject is a global editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }
    let(:another_user) { FactoryBot.create(:user) }
    let(:project) { FactoryBot.create(:project) }
    let(:object) { ProjectCollection.new(resource: project, user: another_user, role_names: "project_editor") }
    the_subject_behaves_like "class abilities", ProjectCollection, all: true
  end
end
