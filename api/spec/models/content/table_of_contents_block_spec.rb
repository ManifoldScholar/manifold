require "rails_helper"

RSpec.describe Content::TableOfContentsBlock do
  let(:toc_block) { FactoryBot.create(:toc_block) }

  it "has a valid factory" do
    expect(FactoryBot.build(:toc_block)).to be_valid
  end

  it "is configurable" do
    expect(toc_block.configurable?).to eq true
  end

  it "responds to :text" do
    expect(toc_block.respond_to? :text).to eq true
  end

  it "is invalid if :text belongs to a different project" do
    text = FactoryBot.create(:text)
    toc_block.content_block_references = [FactoryBot.create(:content_block_reference,
                                                            kind: "text",
                                                            content_block: toc_block,
                                                            referencable: text)]
    expect(toc_block).to_not be_valid
  end

  it "is invalid if depth is not an integer" do
    expect(FactoryBot.build(:toc_block, depth: "string")).to_not be_valid
  end

  it "has a default depth of 6" do
    expect(FactoryBot.create(:toc_block).depth).to eq 6
  end

  it "defaults show_authors to false" do
    expect(FactoryBot.build(:toc_block, show_authors: nil)).to_not be_valid
  end

  it "defaults show_text_title to false" do
    expect(FactoryBot.build(:toc_block, show_text_title: nil)).to_not be_valid
  end

  it "has the correct available attributes" do
    expect(toc_block.available_attributes).to match_array [:depth, :title, :show_authors, :show_text_title]
  end

  describe "#renderable?" do
    context "when :text is present" do
      it "is true" do
        expect(FactoryBot.build(:toc_block).renderable?).to eq true
      end
    end

    context "when :text is not present" do
      it "is false" do
        expect(FactoryBot.build(:toc_block, content_block_references: []).renderable?).to eq false
      end
    end
  end
end
