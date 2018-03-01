require 'rails_helper'

RSpec.describe "Favorite Abilities", :authorizer do
  let(:owner) { FactoryBot.create(:user) }
  let(:object) { FactoryBot.create(:favorite, user: owner) }

  context 'when the subject is an admin' do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    the_subject_behaves_like "instance abilities", Favorite, all: true
  end

  context 'when the subject is a reader' do
    let(:subject) { FactoryBot.create(:user) }

    the_subject_behaves_like "instance abilities", Favorite, none: true
  end

  context 'when the favorite belongs to the subject' do
    let(:subject) { owner }

    the_subject_behaves_like "instance abilities", Favorite, all: true
  end
end
