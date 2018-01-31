require 'rails_helper'

RSpec.describe FlagAuthorizer, :authorizer do
  let(:user) { FactoryGirl.create(:user) }
  let(:admin) { FactoryGirl.create(:user, role: User::ROLE_ADMIN) }
  let(:creator) { FactoryGirl.create(:user) }
  let(:flag_resource) { FactoryGirl.create(:flag, creator: creator) }

  describe 'instance authorization' do
    context 'when deleting' do
      it 'is true for admin' do
        expect(flag_resource).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(flag_resource).to_not be_deletable_by(user)
      end

      it 'is true for creator' do
        expect(flag_resource).to be_deletable_by(creator)
      end
    end
  end
end
