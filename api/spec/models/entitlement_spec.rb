require "rails_helper"

RSpec.describe Entitlement, type: :model do
  let!(:user) { FactoryBot.create :user }

  def have_added_role_for(entity, role, resource = :any)
    change { entity.reload.has_role?(role, resource) }.from(false).to(true)
  end

  context "when creating for a user" do
    it "creates a matching EntitlementUser and grants the user its role" do
      expect do
        FactoryBot.create :entitlement, :global_subscriber, :for_user, user: user
      end.to change(EntitlementUserLink, :count).by(1).and have_added_role_for(user, :subscriber)
    end
  end

  context "when creating for a reading group" do
    let!(:user_1) { FactoryBot.create :user }
    let!(:user_2) { FactoryBot.create :user }

    let!(:reading_group) { FactoryBot.create :reading_group }
    let!(:member_1) { FactoryBot.create :reading_group_membership, reading_group: reading_group, user: user_1 }
    let!(:member_2) { FactoryBot.create :reading_group_membership, reading_group: reading_group, user: user_2 }

    before do
      ReadingGroupMembership.where.not(id: [member_1.id, member_2.id]).destroy_all

      reading_group.reload
    end

    it "creates matching EntitlementUsers for each member and grants them each their role" do
      expect do
        FactoryBot.create :entitlement, :global_subscriber, :for_reading_group, target: reading_group
      end.to change(EntitlementUserLink, :count).by(2).and have_added_role_for(user_1, :subscriber).and have_added_role_for(user_2, :subscriber)
    end
  end

  context "expiration" do
    let!(:entitlement) { FactoryBot.create :entitlement, :global_subscriber, :for_user }

    def change_current_state
      change { entitlement.reload.current_state.to_sym }
    end

    it "automatically sets the state when expiring soon" do
      expect do
        entitlement.expires_on = Date.current + 1
        entitlement.save!
      end.to change_current_state.from(:active).to(:expiring_soon)
    end

    it "automatically sets the state when expired" do
      expect do
        entitlement.expires_on = Date.current.yesterday
        entitlement.save!
      end.to change_current_state.from(:active).to(:expired)
    end
  end
end
