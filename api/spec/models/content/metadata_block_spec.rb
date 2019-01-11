require "rails_helper"

RSpec.describe Content::MetadataBlock do
  let(:metadata_block) { FactoryBot.create(:metadata_block) }

  it "has a valid factory" do
    expect(FactoryBot.build(:metadata_block)).to be_valid
  end

  it "is not configurable" do
    expect(metadata_block.configurable?).to eq false
  end
end
