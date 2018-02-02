require 'rails_helper'

RSpec.describe FlagAuthorizer, :authorizer do
  let(:user) { FactoryBot.create(:user) }
  let(:admin) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }
  let(:creator) { FactoryBot.create(:user) }
  let(:flag_resource) { FactoryBot.create(:flag, creator: creator) }

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
