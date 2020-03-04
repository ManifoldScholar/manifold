require 'rails_helper'

RSpec.describe "User Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }
    let(:object) { FactoryBot.create(:user) }

    the_subject_behaves_like "instance abilities", User, all: true
    the_subject_behaves_like "class abilities", User, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }
    let(:object) { FactoryBot.create(:user) }

    the_subject_behaves_like "instance abilities", User, read_only: true
    the_subject_behaves_like "class abilities", User, read_only: true
  end

  context 'when the subject is a project_creator' do
    let(:subject) { FactoryBot.create(:user, :project_creator) }
    let(:object) { FactoryBot.create(:user) }

    the_subject_behaves_like "instance abilities", User, none: true
    the_subject_behaves_like "class abilities", User, none: true
  end

  # Project editors can assign permissions, so they need to be able to read users. --ZD
  context 'when the subject is a reader and an editor of at least once project' do
    let(:subject) do
      user = FactoryBot.create(:user, :reader)
      user.add_role :project_editor, FactoryBot.create(:project)
      user
    end
    let(:object) { FactoryBot.create(:user) }
    the_subject_behaves_like "instance abilities", User, read_only: true
    the_subject_behaves_like "class abilities", User, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:user) }

    the_subject_behaves_like "instance abilities", User, none: true
    the_subject_behaves_like "class abilities", User, none: true
  end

  context 'when the subject is the user' do
    let(:subject) { FactoryBot.create(:user) }
    let(:object) { subject }

    abilities = { create: false, read: true, update: true, delete: false }
    the_subject_behaves_like "instance abilities", User, abilities
  end
end
