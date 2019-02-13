require "rails_helper"

RSpec.describe Content::ResourcesBlock do
  let(:resource) { FactoryBot.create(:resource)}
  let(:resources_block) { FactoryBot.create(:resources_block, project: resource.project) }

  it "has a valid factory" do
    expect(FactoryBot.build(:resources_block)).to be_valid
  end

  it "is configurable" do
    expect(resources_block.configurable?).to eq true
  end

  it "responds to :featured_collections" do
    expect(resources_block.respond_to? :featured_collections).to eq true
  end

  describe "#renderable?" do
    it "is true" do
      expect(resources_block.renderable?).to eq true
    end
  end
end
