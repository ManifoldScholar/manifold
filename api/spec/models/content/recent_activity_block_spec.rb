require "rails_helper"

RSpec.describe Content::RecentActivityBlock do
  let(:recent_activity_block) { FactoryBot.create(:recent_activity_block) }

  it "has a valid factory" do
    expect(FactoryBot.build(:recent_activity_block)).to be_valid
  end

  it "is not configurable" do
    expect(recent_activity_block.configurable?).to eq false
  end
end
