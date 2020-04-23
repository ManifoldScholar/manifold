require "rails_helper"

RSpec.describe Content::RecentActivityBlock do
  let(:event) { FactoryBot.create(:event) }
  let(:recent_activity_block) { FactoryBot.create(:recent_activity_block, project: event.project) }

  it "has a valid factory" do
    expect(FactoryBot.build(:recent_activity_block)).to be_valid
  end

  it "is configurable" do
    expect(recent_activity_block.configurable?).to eq true
  end

  describe "#renderable?" do
    it "is true" do
      expect(recent_activity_block.renderable?).to eq true
    end
  end
end
