require "rails_helper"

RSpec.describe Text, type: :model do
  describe "#section_at" do
    let!(:text) { FactoryBot.create :text }

    let!(:section_1) { FactoryBot.create :text_section, text: text, position: 1 }
    let!(:section_2) { FactoryBot.create :text_section, text: text, position: 2 }

    it "finds the right sections" do
      aggregate_failures "for each position" do
        expect(text.section_at(1)).to eq section_1
        expect(text.section_at(2)).to eq section_2
      end
    end
  end

  context "when citations are updated" do
    before(:each) do
      @calling_class = FactoryBot.create(:text, title: "A Title")
      @child_class = FactoryBot.create(:text_section, text: @calling_class, name: "Section Name")
    end

    include_examples "a citable class with_citable_children"
  end

  describe "its titles" do
    def expect_setting_to_change!(attribute, new_value)
      expect do
        text.update! attribute => new_value
      end.to execute_safely.and change { text.reload.public_send(attribute) }.to(new_value)
    end

    describe "its main title" do
      let(:text) { FactoryBot.create(:text, title: "**Formatted** _Title_") }

      it "can be set" do
        expect_setting_to_change!(:title, "New Title")
      end

      it "correctly returns the formatted value of main TextTitle association" do
        expect(text.title_formatted).to eq text.title_main.title_formatted
      end

      it "correctly returns the plaintext value of main TextTitle association" do
        expect(text.title_plaintext).to eq text.title_main.title_plaintext
      end
    end

    describe "its subtitle" do
      let(:text) { FactoryBot.create(:text, subtitle: "**Formatted** _Subtitle_") }

      it "can be set" do
        expect_setting_to_change! :subtitle, "New Subtitle"
      end

      it "correctly returns the formatted value of subtitle TextTitle association" do
        expect(text.subtitle_formatted).to eq text.title_subtitle.subtitle_formatted
      end

      it "correctly returns the plaintext value of subtitle TextTitle association" do
        expect(text.subtitle_plaintext).to eq text.title_subtitle.subtitle_plaintext
      end
    end
  end

  describe ".pending_epub_v3_export" do
    let!(:text) { FactoryBot.create :text }

    let(:the_scope) { described_class.pending_epub_v3_export }

    subject { the_scope }

    class << self
      def it_is_found
        it "is found by the scope" do
          expect(the_scope).to include text
        end
      end

      def it_is_not_found
        it "is not found by the scope" do
          expect(the_scope).not_to include text
        end
      end
    end

    context "with a text not marked to export" do
      it_is_not_found
    end

    context "with a text marked to export" do
      let!(:text) { FactoryBot.create :text, :exports_as_epub_v3 }

      context "and no text exports" do
        it_is_found
      end

      context "with a stale export" do
        let!(:text_export) { FactoryBot.create :text_export, :epub_v3, text: text, fingerprint: text.fingerprint.reverse }

        it_is_found
      end

      context "with a current export" do
        let!(:text_export) { FactoryBot.create :text_export, :epub_v3, text: text, fingerprint: text.fingerprint }

        it_is_not_found
      end
    end
  end

  it_should_behave_like "a model that stores its fingerprint" do
    subject { FactoryBot.create :text }
  end

  it_should_behave_like "a model with formatted attributes"

  it_should_behave_like "a collectable"
end
