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

  describe "its starting section" do
    let!(:text) { FactoryBot.create(:text, title: "test text")}
    let!(:valid_section) { FactoryBot.create(:text_section, text: text)}
    let!(:invalid_section) { FactoryBot.create(:text_section)}

    it "is valid when it is a section of the text" do
      text.start_text_section_id = valid_section.id
      expect(text.valid?).to be true
    end

    it "is invalid when it is not a section of the text" do
      text.start_text_section_id = invalid_section.id
      expect(text.valid?).to be false
    end
  end

  describe "its toc" do
    let!(:text) { FactoryBot.create(:text, title: "test text")}
    let!(:section_one) { FactoryBot.create(:text_section, text: text)}
    let!(:section_two) { FactoryBot.create(:text_section, text: text)}
    let(:new_toc) { [{label: "one", id: section_one.id, type: "test"}, {label: "two", id: section_two.id}] }
    let(:new_toc_invalid_entry) { [*new_toc, {label: "three"}]}

    it "is valid when all entries have a valid section id" do
      text.toc = new_toc

      expect(text).to be_valid
    end

    it "is invalid when an entry has an invalid section id" do
      text.toc = new_toc_invalid_entry

      expect(text).to be_invalid
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

  specify "a new text can create sections from a list of names" do
    new_text = Text.new
    new_text.section_names= %w[foo bar]

    expect(new_text.text_sections.size).to eq 2
  end

  context "when created from an api request" do
    let!(:new_text) { FactoryBot.create(:text, title: nil) }

    it "validates its main title" do
      expect(new_text).to be_invalid(:from_api)

      new_text.title = "something"

      expect(new_text).to be_valid(:from_api)
    end
  end

  context "when a section is deleted" do
    let!(:text) { FactoryBot.create(:text)}
    let!(:section_one) { FactoryBot.create(:text_section, text: text)}
    let!(:section_two) { FactoryBot.create(:text_section, text: text)}
    let(:toc) { [{label: "one", id: section_one.id}, {label: "two", id: section_two.id, children: [{label: "one_child", id: section_one.id}]}, {label: "three", id: section_one.id}] }

    before do
      text.update! :toc => toc
    end

    specify "all linked toc entries are also deleted" do
      section_one.destroy
      text.reload

      expect(text.toc.size).to eq 1
      expect(text.toc.first[:children].empty?).to be true
    end
  end

  it_should_behave_like "a model that stores its fingerprint" do
    subject { FactoryBot.create :text }
  end

  it_should_behave_like "a model with formatted attributes"

  it_should_behave_like "a collectable"
end
