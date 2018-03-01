require 'rails_helper'

RSpec.describe "Statistics Abilities", :authorizer do
  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    the_subject_behaves_like "class abilities", Statistics, read_only: true
  end

  context 'when the subject is an editor' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }

    the_subject_behaves_like "class abilities", Statistics, read_only: true
  end

  context 'when the subject is a marketeer' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_MARKETEER) }

    the_subject_behaves_like "class abilities", Statistics, read_only: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    the_subject_behaves_like "class abilities", Statistics, none: true
  end
end
