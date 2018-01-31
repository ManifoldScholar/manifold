require 'rails_helper'

RSpec.describe SettingsAuthorizer, :authorizer do
  let(:user) { FactoryBot.create(:user) }
  let(:admin) { FactoryBot.create(:user, role: User::ROLE_ADMIN) }

  describe 'class authorization' do
    context 'when updating' do
      it 'is true for admin' do
        expect(SettingsAuthorizer).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(SettingsAuthorizer).to_not be_updatable_by(user)
      end
    end
  end

  describe 'instance authorization' do
    # TODO: Use settings factory instead of instance
    let(:settings_resource) { Settings.instance }

    context 'when reading' do
      it 'is true for admin' do
        expect(settings_resource).to be_readable_by(admin)
      end

      it 'is false for user' do
        expect(settings_resource).to_not be_readable_by(user)
      end
    end
  end
end
