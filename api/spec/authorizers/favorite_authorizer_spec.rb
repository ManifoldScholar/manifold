require 'rails_helper'

RSpec.describe FavoriteAuthorizer, :authorizer do
  let(:user) { FactoryBot.create(:user) }
  let(:admin) { FactoryBot.create(:user, role: User::ROLE_ADMIN) }

  describe 'instance authorization' do
    let(:owner) { FactoryBot.create(:user) }
    let(:favorite_resource) { FactoryBot.create(:favorite, user: owner) }

    context 'when reading' do
      it 'is true for admin' do
        expect(favorite_resource).to be_readable_by(admin)
      end

      it 'is false for user' do
        expect(favorite_resource).to_not be_readable_by(user)
      end

      it 'is true for owner' do
        expect(favorite_resource).to be_readable_by(owner)
      end
    end

    context 'when creating' do
      it 'is true for admin' do
        expect(favorite_resource).to be_creatable_by(admin)
      end

      it 'is false for user' do
        expect(favorite_resource).to_not be_creatable_by(user)
      end

      it 'is true for owner' do
        expect(favorite_resource).to be_creatable_by(owner)
      end
    end

    context 'when updating' do
      it 'is true for admin' do
        expect(favorite_resource).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(favorite_resource).to_not be_updatable_by(user)
      end

      it 'is true for owner' do
        expect(favorite_resource).to be_updatable_by(owner)
      end
    end

    context 'when deleting' do
      it 'is true for admin' do
        expect(favorite_resource).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(favorite_resource).to_not be_deletable_by(user)
      end

      it 'is true for owner' do
        expect(favorite_resource).to be_deletable_by(owner)
      end
    end
  end

end
