require 'rails_helper'

RSpec.describe EventAuthorizer, :authorizer do
  let(:user) { FactoryBot.create(:user) }
  let(:admin) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

  describe 'class authorization' do
    context 'when deleting' do
      it 'is true for admin' do
        expect(EventAuthorizer).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(EventAuthorizer).to_not be_deletable_by(user)
      end
    end
  end
end
