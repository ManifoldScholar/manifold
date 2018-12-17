require "rails_helper"

RSpec.describe Content::TOCBlock do
  let(:toc_block) { FactoryBot.create(:toc_block) }

  it "has a valid factory" do
    expect(FactoryBot.build(:toc_block)).to be_valid
  end

  it "responds to :text" do
    expect(toc_block.respond_to? :text).to eq true
  end

  it "is invalid if :text is not present" do
    expect(FactoryBot.build(:toc_block, content_block_references: [])).to_not be_valid
  end

  it "is invalid if :text belongs to a different project" do
    text = FactoryBot.create(:text)
    toc_block.content_block_references = [FactoryBot.create(:content_block_reference,
                                                            kind: "texts",
                                                            content_block: toc_block,
                                                            referencable: text)]
    expect(toc_block).to_not be_valid
  end

  it "is invalid if depth is not an integer" do
    expect(FactoryBot.build(:toc_block, depth: "string")).to_not be_valid
  end

  it "is invalid if show_authors is not a boolean" do
    expect(FactoryBot.build(:toc_block, show_authors: nil)).to_not be_valid
  end

  it "is invalid if show_text_title is not a boolean" do
    expect(FactoryBot.build(:toc_block, show_text_title: nil)).to_not be_valid
  end

  it "has the correct permitted attributes" do
    expect(toc_block.permitted_attributes).to match_array [:depth, :show_authors, :show_text_title]
  end
end
