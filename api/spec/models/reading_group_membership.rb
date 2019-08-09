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


end
