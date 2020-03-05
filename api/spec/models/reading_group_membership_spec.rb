require "rails_helper"

RSpec.describe ReadingGroupMembership, type: :model do

  it "has a valid factory" do
    expect(FactoryBot.build(:reading_group_membership)).to be_valid
  end

  it "can be persisted" do
    expect(FactoryBot.create(:reading_group_membership).persisted?).to be true
  end

  it "is invalid without a user" do
    subject = FactoryBot.build(:reading_group_membership)
    subject.user = nil
    expect(subject.valid?).to be false
  end

  it "is invalid without a reading group" do
    subject = FactoryBot.build(:reading_group_membership)
    subject.reading_group = nil
    expect(subject.valid?).to be false
  end

  context "when adding a member to a reading group that has an existing entitlement" do
    let!(:reading_group) { FactoryBot.create :reading_group }
    let!(:entitlement) { FactoryBot.create :entitlement, :global_subscriber, :for_reading_group, target: reading_group }
    let!(:user) { FactoryBot.create :user }

    it "enrolls the user" do
      expect do
        FactoryBot.create :reading_group_membership, reading_group: reading_group, user: user
      end.to change(EntitlementUserLink, :count).by(1).and change { user.reload.has_role?(:subscriber, :any) }.from(false).to(true)
    end
  end
end
