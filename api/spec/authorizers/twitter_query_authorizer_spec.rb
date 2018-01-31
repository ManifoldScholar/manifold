require 'rails_helper'

RSpec.describe TwitterQueryAuthorizer, :authorizer do
  let(:user) { FactoryGirl.create(:user) }
  let(:admin) { FactoryGirl.create(:user, role: User::ROLE_ADMIN) }

  describe 'class authorization' do
    context 'when reading' do
      it 'is true for admin' do
        expect(TwitterQueryAuthorizer).to be_readable_by(admin)
      end

      it 'is false for user' do
        expect(TwitterQueryAuthorizer).to_not be_readable_by(user)
      end
    end

    context 'when creating' do
      it 'is true for admin' do
        expect(TwitterQueryAuthorizer).to be_creatable_by(admin)
      end

      it 'is false for user' do
        expect(TwitterQueryAuthorizer).to_not be_creatable_by(user)
      end
    end

    context 'when updating' do
      it 'is true for admin' do
        expect(TwitterQueryAuthorizer).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(TwitterQueryAuthorizer).to_not be_updatable_by(user)
      end
    end

    context 'when deleting' do
      it 'is true for admin' do
        expect(TwitterQueryAuthorizer).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(TwitterQueryAuthorizer).to_not be_deletable_by(user)
      end
    end
  end
end
