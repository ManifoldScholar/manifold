require "rails_helper"

RSpec.describe ContentBlockReference do
  let(:content_block_reference) { FactoryBot.create(:content_block_reference) }

  it "has a valid factory" do
    expect(FactoryBot.build(:content_block_reference)).to be_valid
  end

  it "belongs to a ContentBlock" do
    association = described_class.reflect_on_association :content_block
    expect(association.macro).to eq :belongs_to
  end

  it "belongs to a Referencable" do
    association = described_class.reflect_on_association :referencable
    expect(association.macro).to eq :belongs_to
  end

  it "is invalid without a kind" do
    expect(FactoryBot.build(:content_block_reference, kind: nil)).to_not be_valid
  end
end
