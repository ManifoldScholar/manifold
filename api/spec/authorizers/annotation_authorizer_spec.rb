require 'rails_helper'

RSpec.describe "Annotation Abilities", :authorizer do
  let(:user) { FactoryBot.create(:user) }
  let(:creator) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project, draft: false) }
  let(:text) { FactoryBot.create(:text, project: project) }
  let(:object) { FactoryBot.create(:annotation, creator: creator, private: false, text: text) }

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    the_subject_behaves_like "instance abilities", Annotation, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }

    the_subject_behaves_like "instance abilities", Annotation, all: true
  end

  context 'when the subject is a resource editor for the annotation\'s project' do
    let(:subject) do
      user = FactoryBot.create(:user)
      user.add_role Role::ROLE_PROJECT_EDITOR, project
      user
    end

    context "when the annotation is a text annotation created by another user" do
      abilities = { create: true, read: true, update: false, delete: false }
      the_subject_behaves_like "instance abilities", Annotation, abilities
    end

    context "when the annotation is a resource annotation created by another user" do
      let(:object) do
        FactoryBot.create(:resource_annotation, creator: creator, private: false, text: text)
      end
      abilities = { create: true, read: true, update: true, delete: true }
      the_subject_behaves_like "instance abilities", Annotation, abilities
    end
  end

  context 'when the subject is a reader' do

    context "when the annotation is a resource annotation created by another user" do
      let(:object) do
        FactoryBot.create(:resource_annotation, creator: creator, private: false, text: text)
      end
      let(:subject) { user }
      abilities = { create: false, read: true, update: false, delete: false}
      the_subject_behaves_like "instance abilities", Annotation, abilities
    end
  end

  context 'when the subject is the resource creator' do
    let(:subject) { creator }
    abilities = { all: true }

    the_subject_behaves_like "instance abilities", Annotation, abilities
  end

  context 'when the subject is a reader' do
    context 'when annotation is public' do
      let(:subject) { user }
      abilities = { create: true, read: true, update: false, delete: false }

      the_subject_behaves_like "instance abilities", Annotation, abilities
    end
    context 'when annotation is private' do
      let(:subject) { user }
      let(:object) { FactoryBot.create(:annotation, creator: creator, private: true) }
      abilities = { create: true, read: false, update: false, delete: false }

      the_subject_behaves_like "instance abilities", Annotation, abilities
    end
  end
end
