require "rails_helper"

RSpec.describe Content::RecentActivityBlock do
  let(:recent_activity_block) { FactoryBot.create(:recent_activity_block) }

  it "has a valid factory" do
    expect(FactoryBot.build(:recent_activity_block)).to be_valid
  end

  it "is not configurable" do
    expect(recent_activity_block.configurable?).to eq false
  end

  describe "#renderable?" do
    it "is true" do
      expect(FactoryBot.build(:metadata_block).renderable?).to eq true
    end
  end
end
