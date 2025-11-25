# frozen_string_literal: true

RSpec.describe "Flag Abilities", :authorizer do
  let_it_be(:creator, refind: true) { FactoryBot.create(:user, :reader) }
  let_it_be(:object, refind: true) { FactoryBot.create(:flag, creator: creator) }

  context 'when the subject is an admin' do
    let_it_be(:subject, refind: true) { FactoryBot.create(:user, :admin) }

    abilities = { create: true, read: false, update: false, delete: true }
    the_subject_behaves_like "instance abilities", Flag, abilities
  end

  context 'when the subject is a reader' do
    let_it_be(:subject, refind: true) { FactoryBot.create(:user) }

    abilities = { create: true, read: false, update: false, delete: false }
    the_subject_behaves_like "instance abilities", Flag, abilities
  end

  context 'when the subject is the resource creator' do
    let_it_be(:subject, refind: true) { creator }

    abilities = { create: true, read: false, update: false, delete: true }
    the_subject_behaves_like "instance abilities", Flag, abilities
  end
end
