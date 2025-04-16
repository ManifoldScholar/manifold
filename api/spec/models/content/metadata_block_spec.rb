# frozen_string_literal: true

require "rails_helper"

RSpec.describe Content::MetadataBlock do
  let(:project) { FactoryBot.create(:project, metadata: { isbn: "1234" }) }
  let(:metadata_block) { FactoryBot.create(:metadata_block, project: project) }

  it "has a valid factory" do
    expect(FactoryBot.build(:metadata_block)).to be_valid
  end

  it "is configurable" do
    expect(metadata_block.configurable?).to be true
  end

  describe "#renderable?" do
    it "is true" do
      expect(metadata_block.renderable?).to be true
    end
  end
end
