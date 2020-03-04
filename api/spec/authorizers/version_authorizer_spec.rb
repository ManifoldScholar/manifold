require 'rails_helper'

RSpec.describe "Version Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }

    abilities = { create: false, read: true, update: false, delete: false }

    the_subject_behaves_like "class abilities", Version, abilities
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }

    abilities = { create: false, read: true, update: false, delete: false }

    the_subject_behaves_like "class abilities", Version, abilities
  end
end
