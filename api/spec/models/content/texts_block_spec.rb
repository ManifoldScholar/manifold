require "rails_helper"

RSpec.describe Content::TextsBlock do

  let(:text) { FactoryBot.create(:text)}
  let(:texts_block) { FactoryBot.create(:texts_block, project: text.project) }

  it "has a valid factory" do
    expect(FactoryBot.build(:texts_block)).to be_valid
  end

  it "is configurable" do
    expect(texts_block.configurable?).to eq true
  end

  it "responds to :included_categories" do
    expect(texts_block.respond_to? :included_categories).to eq true
  end

  it "responds to :texts" do
    expect(texts_block.respond_to? :texts).to eq true
  end

  it "has the correct available attributes" do
    expect(texts_block.available_attributes).to match_array [:show_authors, :show_descriptions, :show_subtitles, :show_covers, :show_dates, :show_category_labels, :title, :description, :show_uncategorized]
  end

  it "has a formatted description" do
    expect(texts_block.respond_to? :description_formatted).to eq true
  end

  describe "#texts" do
    let(:project) { FactoryBot.create(:project) }
    let(:category_a) { FactoryBot.create(:category, title: "A") }
    let(:category_b) { FactoryBot.create(:category, title: "B") }
    let(:text_a) { FactoryBot.create(:text, project: project, category: category_a) }
    let(:text_b) { FactoryBot.create(:text, project: project, category: category_b) }
    let(:text_c) { FactoryBot.create(:text, project: project, category: nil) }
    let(:texts_block) { FactoryBot.create(:texts_block, project: project) }

    context "when not filtered by category" do
      context "when show_uncategorized is true" do
        it "returns all project texts" do
          expect(texts_block.texts).to eq project.texts
        end
      end

      context "when show_uncategorized is false" do
        before(:each) { texts_block.update(show_uncategorized: false) }

        it "excludes project texts without a category" do
          expect(texts_block.texts).to match_array [text_a, text_b]
        end
      end
    end

    context "when filtered by category" do
      before(:each) do
        texts_block.content_block_references << FactoryBot.create(:content_block_reference,
                                                                  kind: "included_categories",
                                                                  referencable: category_a)
      end

      context "when show_uncategorized is true" do
        it "returns the related categories' texts and uncategorized texts" do
          expect(texts_block.texts).to match_array [category_a.texts, text_c].flatten
        end
      end

      context "when show_uncategorized is false" do
        before(:each) { texts_block.update(show_uncategorized: false) }

        it "returns the related category texts" do
          expect(texts_block.texts).to eq category_a.texts
        end
      end
    end
  end

  describe "#renderable?" do
    it "is true" do
      expect(texts_block.renderable?).to eq true
    end
  end
end
