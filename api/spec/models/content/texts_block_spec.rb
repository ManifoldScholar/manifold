# frozen_string_literal: true

RSpec.describe Content::TextsBlock do
  let(:text) { FactoryBot.create(:text) }
  let(:texts_block) { FactoryBot.create(:texts_block, project: text.project) }

  subject { texts_block }

  it "has a valid factory" do
    expect(FactoryBot.build(:texts_block)).to be_valid
  end

  it "is configurable" do
    expect(texts_block.configurable?).to be true
  end

  it "responds to :included_categories" do
    expect(texts_block.respond_to?(:included_categories)).to be true
  end

  it "responds to :texts" do
    expect(texts_block.respond_to?(:texts)).to be true
  end

  it "has the correct available attributes" do
    expect(texts_block.available_attributes).to contain_exactly(:show_authors, :show_descriptions, :show_subtitles, :show_covers, :show_dates, :show_category_labels, :title, :description, :show_uncategorized)
  end

  it "has a formatted description" do
    expect(texts_block.respond_to?(:description_formatted)).to be true
  end

  describe "#texts" do
    let_it_be(:project, refind: true) { FactoryBot.create(:project) }
    let_it_be(:category_a, refind: true) { FactoryBot.create(:category, title: "A", project: project) }
    let_it_be(:category_b, refind: true) { FactoryBot.create(:category, title: "B", project: project) }
    let_it_be(:text_a, refind: true) { FactoryBot.create(:text, project: project, category: category_a) }
    let_it_be(:text_b, refind: true) { FactoryBot.create(:text, project: project, category: category_b) }
    let_it_be(:text_c, refind: true) { FactoryBot.create(:text, project: project, category: nil) }

    let!(:texts_block) do
      block = FactoryBot.create(:texts_block, project: project)
    ensure
      block.reload_project
      block.project.texts.reload
    end

    context "when not filtered by category" do
      context "when show_uncategorized is true" do
        it "returns all project texts" do
          expect(texts_block.texts.reload).to match_array [text_a, text_b, text_c]
        end
      end

      context "when show_uncategorized is false" do
        before do
          texts_block.update(show_uncategorized: false)
        end

        it "excludes project texts without a category" do
          expect(texts_block.texts.reload.to_a).to exclude text_c
        end
      end
    end

    context "when filtered by category" do
      let!(:reference) do
        FactoryBot.create(
          :content_block_reference,
          content_block: texts_block,
          kind: "included_categories",
          referencable: category_a
        )
      ensure
        texts_block.reload
      end

      it "can handle removal of a referenced category" do
        category_a.destroy!

        expect(texts_block.reload.included_category_ids).to be_blank
      end

      context "when show_uncategorized is true" do
        it "returns the related categories' texts and uncategorized texts" do
          expect(texts_block.texts.reload.ids).to exclude text_b.id
        end
      end

      context "when show_uncategorized is false" do
        before do
          texts_block.update(show_uncategorized: false)
        end

        it "returns the related category texts" do
          expect(texts_block.texts.reload.ids).to exclude(text_b.id).and(exclude(text_c.id))
        end
      end
    end
  end

  describe "#renderable?" do
    it { is_expected.to be_renderable }
  end

  it_behaves_like "a model with formatted attributes"
end
