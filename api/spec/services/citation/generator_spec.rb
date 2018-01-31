require 'rails_helper'

RSpec.describe Citation::Generator do

  let(:generator) { Citation::Generator.new }
  let(:author_1) { FactoryBot.create(:maker)}
  let(:author_2) { FactoryBot.create(:maker)}

  let(:text) do
    text = FactoryBot.create(:text)
    text.metadata = {
      publisher: "University of Minnesota Press",
      issued: Date.today,
    }
    text.creators << author_1
    text.creators << author_2
    text.save
    text
  end

  let(:text_section) do
    text_section = FactoryBot.create(:text_section, text: text, name: "Chapter One")
    text_section
  end

  context "when the subject is citable" do

    let(:citations) {
      citations = generator.cite(text_section, text_section.citation_styles)
    }

    it "returns a hash" do
      expect(citations).to be_a Hash
    end

    it "returns a hash without any blank citations" do
      expect(citations.any?{ |k, c| !c.is_a?(String) || c.blank? }).to be false
    end

    it "correctly keys the citations" do
      expect(citations.keys).to eq text_section.citation_styles.keys
    end

  end

  context "when the subject is citable but incomplete" do

    let(:subject) { TextSection.create }
    let(:citations) {
      citations = generator.cite(subject, subject.citation_styles)
    }

    it "returns a hash" do
      expect(citations).to be_a Hash
    end

    it "returns a hash without any blank citations" do
      expect(citations.any?{ |k, c| !c.is_a?(String) || c.blank? }).to be false
    end

  end

  context "when the subject is not citable" do

    let(:maker) { FactoryBot.create(:maker) }
    let(:citations) { citations = generator.cite(maker, []) }

    it "returns a hash" do
      expect(citations).to be_a Hash
    end

    it "returns an empty hash" do
      expect(citations.length).to eq 0
    end

  end

end
