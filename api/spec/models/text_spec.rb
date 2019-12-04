require "rails_helper"

RSpec.describe Text, type: :model do
  let(:new_text) { Text.new }
  let(:text_with_sections) do
    text = FactoryBot.create(:text)
    text.text_sections << FactoryBot.create(:text_section, position: 1)
    text.text_sections << FactoryBot.create(:text_section, position: 2)
    text.text_sections << FactoryBot.create(:text_section, position: 3)
    text.text_sections << FactoryBot.create(:text_section, position: 4)
    text.text_sections << FactoryBot.create(:text_section, position: 5)
    text
  end

  it "has a valid factory" do
    expect(FactoryBot.build(:text)).to be_valid
  end

  it "correctly returns the section at a certain position" do
    text = text_with_sections
    sections = text.text_sections
    expect(text.section_at(2)).to eq sections.second
  end

  it "has many titles" do
    text = new_text
    2.times { text.titles.build }
    expect(text.titles.length).to be 2
  end

  it "has many text subjects" do
    text = new_text
    2.times { text.text_subjects.build }
    expect(text.text_subjects.length).to be 2
  end

  it "has many ingestion sources" do
    text = new_text
    2.times { text.ingestion_sources.build }
    expect(text.ingestion_sources.length).to be 2
  end

  it "has many text sections" do
    text = new_text
    2.times { text.text_sections.build }
    expect(text.text_sections.length).to be 2
  end

  it "has many stylesheets" do
    text = new_text
    2.times { text.stylesheets.build }
    expect(text.stylesheets.length).to be 2
  end

  it "belongs to a project" do
    text = new_text
    project = Project.new
    text.project = project
    expect(text.project).to be project
  end

  it "belongs to a category" do
    text = new_text
    category = Category.new
    text.category = category
    expect(text.category).to be category
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

  it_should_behave_like "a model that stores its fingerprint" do
    subject { FactoryBot.create :text }
  end
end
