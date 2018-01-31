require 'rails_helper'

RSpec.describe CommentAuthorizer, :authorizer do
  let(:user) { FactoryGirl.create(:user) }
  let(:admin) { FactoryGirl.create(:user, role: User::ROLE_ADMIN) }

  describe 'instance authorization' do
    let(:creator) { FactoryGirl.create(:user) }
    let(:comment_resource) { FactoryGirl.create(:comment, creator: creator) }

    context 'when updating' do
      it 'is true for admin' do
        expect(comment_resource).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(comment_resource).to_not be_updatable_by(user)
      end

      it 'is true for creator' do
        expect(comment_resource).to be_updatable_by(creator)
      end
    end

    context 'when deleting' do
      it 'is true for admin' do
        expect(comment_resource).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(comment_resource).to_not be_deletable_by(user)
      end

      it 'is true for creator' do
        expect(comment_resource).to be_deletable_by(creator)
      end
    end

    context "when deleted" do
      before(:each) do
        comment_resource.update_attribute(:deleted, true)
      end
      it 'is readable by admin' do
        expect(comment_resource).to be_readable_if_deleted_by(admin)
      end

      it 'is not readable by user' do
        expect(comment_resource).to_not be_readable_if_deleted_by(user)
      end
    end
  end
end
