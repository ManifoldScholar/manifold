require "rails_helper"

RSpec.describe ContentBlock do
  let(:content_block) { FactoryBot.create(:content_block) }

  it "has a valid factory" do
    expect(FactoryBot.build(:content_block)).to be_valid
  end

  it "has many ContentBlockReferences" do
    association = described_class.reflect_on_association :content_block_references
    expect(association.macro).to eq :has_many
  end

  describe "#reference_configurations" do
    it "returns an array of Content::ReferenceConfigurations" do
      expect(content_block.reference_configurations).to all(is_a? Content::ReferenceConfiguration)
    end
  end

  describe "#reference_associations" do
    it "returns a hash of associations" do
      expect(content_block.reference_associations).to be_a Hash
    end
  end
end
