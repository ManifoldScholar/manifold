require 'rails_helper'

RSpec.describe PermissionAuthorizer, :authorizer do
  let(:reader) { FactoryBot.create(:user) }
  let(:editor) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
  let(:admin) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

  describe 'class authorization' do
    context 'when reading' do
      it 'is true for admin' do
        expect(PermissionAuthorizer).to be_readable_by(admin)
      end

      it 'is true for editor' do
        expect(PermissionAuthorizer).to be_readable_by(editor)
      end

      it 'is false for user' do
        expect(PermissionAuthorizer).to_not be_readable_by(reader)
      end
    end

    context 'when updating' do
      it 'is true for admin' do
        expect(PermissionAuthorizer).to be_updatable_by(admin)
      end

      it 'is true for editor' do
        expect(PermissionAuthorizer).to be_updatable_by(editor)
      end

      it 'is false for user' do
        expect(PermissionAuthorizer).to_not be_updatable_by(reader)
      end
    end

    context 'when creating' do
      it 'is true for admin' do
        expect(PermissionAuthorizer).to be_creatable_by(admin)
      end

      it 'is true for editor' do
        expect(PermissionAuthorizer).to be_creatable_by(editor)
      end

      it 'is false for user' do
        expect(PermissionAuthorizer).to_not be_creatable_by(reader)
      end
    end

    context 'when deleting' do
      it 'is true for admin' do
        expect(PermissionAuthorizer).to be_deletable_by(admin)
      end

      it 'is true for editor' do
        expect(PermissionAuthorizer).to be_deletable_by(editor)
      end

      it 'is false for user' do
        expect(PermissionAuthorizer).to_not be_deletable_by(reader)
      end
    end
  end

  describe 'instance authorization' do
    before(:all) do
      project = FactoryBot.create(:project)
      @owner = FactoryBot.create(:user, role: Role::ROLE_EDITOR)
      @owner.add_role :owner, project
      @permission = Permission.fetch(project, @owner)
    end

    context 'when reading' do
      it 'is true for admin' do
        expect(@permission).to be_readable_by(admin)
      end

      it 'is false for user' do
        expect(@permission).to_not be_readable_by(reader)
      end

      it 'is true for owner' do
        expect(@permission).to be_readable_by(@owner)
      end
    end

    context 'when updating' do
      it 'is true for admin' do
        expect(@permission).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(@permission).to_not be_updatable_by(reader)
      end

      it 'is true for owner' do
        expect(@permission).to be_readable_by(@owner)
      end
    end
  end
end
