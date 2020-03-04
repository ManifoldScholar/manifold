require 'rails_helper'

RSpec.describe "Permission Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }

    the_subject_behaves_like "class abilities", Permission, all: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    the_subject_behaves_like "class abilities", Permission, none: true
  end

  context "when the subject is an editor on the permission's project" do
    let(:project) { FactoryBot.create(:project) }
    let(:another_user) { FactoryBot.create(:user) }
    let(:subject) do
      user = FactoryBot.create(:user)
      user.add_role :project_editor, project
      user
    end
    let(:object) { Permission.new(resource: project, user: another_user, role_names: %[project_editor]) }
    the_subject_behaves_like "instance abilities", Permission, none: true
  end

  context 'when the subject is a global editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }
    let(:another_user) { FactoryBot.create(:user) }
    let(:project) { FactoryBot.create(:project) }
    let(:object) { Permission.new(resource: project, user: another_user, role_names: %[project_editor]) }
    the_subject_behaves_like "instance abilities", Permission, all: true
  end

  context "when the subject is the creator of the permission's project" do
    let(:subject) { FactoryBot.create(:user, :project_creator) }
    let(:object) { FactoryBot.create(:project, creator: subject) }
    the_subject_behaves_like "instance abilities", Permission, all: true
  end
end
