require 'rails_helper'

RSpec.describe UserAuthorizer, :authorizer do
  let(:user) { FactoryGirl.create(:user) }
  let(:admin) { FactoryGirl.create(:user, role: User::ROLE_ADMIN) }

  describe 'class authorization' do
    context 'when reading' do
      it 'is true for admin' do
        expect(UserAuthorizer).to be_readable_by(admin)
      end

      it 'is false for user' do
        expect(UserAuthorizer).to_not be_readable_by(user)
      end
    end

    context 'when updating' do
      it 'is true for admin' do
        expect(UserAuthorizer).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(UserAuthorizer).to_not be_updatable_by(user)
      end
    end

    context 'when deleting' do
      it 'is true for admin' do
        expect(UserAuthorizer).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(UserAuthorizer).to_not be_deletable_by(user)
      end
    end
  end

  describe 'instance authorization' do
    let(:user_resource) { FactoryGirl.create(:user) }

    context 'when reading' do
      it 'is true for admin' do
        expect(user_resource).to be_readable_by(admin)
      end

      it 'is false for user' do
        expect(user_resource).to_not be_readable_by(user)
      end

      it 'is true for self' do
        expect(user_resource).to be_readable_by(user_resource)
      end
    end

    context 'when creating' do
      it 'is true for admin' do
        expect(user_resource).to be_creatable_by(admin)
      end

      it 'is false for user' do
        expect(user_resource).to_not be_creatable_by(user)
      end
    end

    context 'when updating' do
      it 'is true for admin' do
        expect(user_resource).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(user_resource).to_not be_updatable_by(user)
      end

      it 'is true for self' do
        expect(user_resource).to be_updatable_by(user_resource)
      end
    end

    context 'when deleting' do
      it 'is true for admin' do
        expect(user_resource).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(user_resource).to_not be_deletable_by(user)
      end
    end
  end

end
