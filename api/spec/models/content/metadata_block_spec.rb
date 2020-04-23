require "rails_helper"

RSpec.describe Content::MetadataBlock do
  let(:project) { FactoryBot.create(:project, metadata: { isbn: "1234" }) }
  let(:metadata_block) { FactoryBot.create(:metadata_block, project: project) }

  it "has a valid factory" do
    expect(FactoryBot.build(:metadata_block)).to be_valid
  end

  it "is configurable" do
    expect(metadata_block.configurable?).to eq true
  end

  describe "#renderable?" do
    it "is true" do
      expect(metadata_block.renderable?).to eq true
    end
  end
end
