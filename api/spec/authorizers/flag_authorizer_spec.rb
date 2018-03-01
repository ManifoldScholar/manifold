require 'rails_helper'

RSpec.describe "Flag Abilities", :authorizer do
  let(:creator) { FactoryBot.create(:user, role: Role::ROLE_READER) }
  let(:object) { FactoryBot.create(:flag, creator: creator) }

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    abilities = { create: true, read: false, update: false, delete: true }
    the_subject_behaves_like "instance abilities", Flag, abilities
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    abilities = { create: true, read: false, update: false, delete: false }
    the_subject_behaves_like "instance abilities", Flag, abilities
  end

  context 'when the subject is the resource creator' do
    let(:subject) { creator }

    abilities = { create: true, read: false, update: false, delete: true }
    the_subject_behaves_like "instance abilities", Flag, abilities
  end
end
