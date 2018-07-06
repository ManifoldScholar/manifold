require 'rails_helper'

RSpec.describe "Annotation Abilities", :authorizer do
  let(:user) { FactoryBot.create(:user) }
  let(:creator) { FactoryBot.create(:user) }
  let(:object) { FactoryBot.create(:annotation, creator: creator, private: false) }

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    the_subject_behaves_like "instance abilities", Annotation, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }

    the_subject_behaves_like "instance abilities", Annotation, all: true
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
