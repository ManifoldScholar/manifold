require "rails_helper"

RSpec.describe Content::ResourcesBlock do
  let(:resources_block) { FactoryBot.create(:resources_block) }

  it "has a valid factory" do
    expect(FactoryBot.build(:resources_block)).to be_valid
  end

  it "is configurable" do
    expect(resources_block.configurable?).to eq true
  end

  it "responds to :featured_collections" do
    expect(resources_block.respond_to? :featured_collections).to eq true
  end

  it "responds to :featured_resources" do
    expect(resources_block.respond_to? :featured_resources).to eq true
  end

  it "is invalid if :resources_count is not an integer" do
    expect(FactoryBot.build(:resources_block, resources_count: "string")).to_not be_valid
  end

  it "has the correct available attributes" do
    expect(resources_block.available_attributes).to match_array [:resources_count]
  end
end
