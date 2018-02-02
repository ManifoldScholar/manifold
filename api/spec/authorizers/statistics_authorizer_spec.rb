require 'rails_helper'

RSpec.describe StatisticsAuthorizer, :authorizer do
  let(:user) { FactoryBot.create(:user) }
  let(:admin) { FactoryBot.create(:user, role: User::ROLE_ADMIN) }

  describe 'class authorization' do
    context 'when reading' do
      it 'is true for admin' do
        expect(StatisticsAuthorizer).to be_readable_by(admin)
      end

      it 'is false for user' do
        expect(StatisticsAuthorizer).to_not be_readable_by(user)
      end
    end
  end
end
