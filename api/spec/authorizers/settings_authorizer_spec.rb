require 'rails_helper'

RSpec.describe "Settings Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, :admin) }

    abilities = { create: false, read: true, update: true, delete: false }
    the_subject_behaves_like "class abilities", Settings, abilities
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, :editor) }

    the_subject_behaves_like "class abilities", Settings, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    the_subject_behaves_like "class abilities", Settings, read_only: true
  end
end
