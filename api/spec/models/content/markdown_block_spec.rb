require "rails_helper"

RSpec.describe Content::MarkdownBlock do
  let(:markdown_block) { FactoryBot.create(:markdown_block) }

  it "has a valid factory" do
    expect(FactoryBot.build(:markdown_block)).to be_valid
  end

  it "is configurable" do
    expect(markdown_block.configurable?).to eq true
  end

  it "is invalid if style is blank" do
    expect(FactoryBot.build(:markdown_block, style: "")).to_not be_valid
  end

  it "is invalid if body is not present" do
    expect(FactoryBot.build(:markdown_block, body: nil)).to_not be_valid
  end

  it "is invalid if style is not \"shaded\" or \"normal\"" do
    expect(FactoryBot.build(:markdown_block, style: "camo")).to_not be_valid
  end

  it "has the correct available attributes" do
    expect(markdown_block.available_attributes).to match_array [:style, :body]
  end
end
