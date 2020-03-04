require 'rails_helper'

RSpec.describe "Comment Abilities", :authorizer do
  let(:creator) { FactoryBot.create(:user, :reader) }
  let(:object) { FactoryBot.create(:comment, creator: creator) }

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }

    the_subject_behaves_like "instance abilities", Comment, all: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }

    abilities = { create: true, read: true, update: false, delete: true }
    the_subject_behaves_like "instance abilities", Comment, abilities
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    abilities = { create: true, read: true, update: false, delete: false }
    the_subject_behaves_like "instance abilities", Comment, abilities
  end

  context 'when the subject is the resource creator' do
    let(:subject) { creator }

    the_subject_behaves_like "instance abilities", Comment, all: true
  end
end
