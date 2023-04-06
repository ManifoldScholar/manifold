require "rails_helper"

RSpec.describe Ingestions::TextSection::Ingestor do
  context "when a Word Doc", slow: true do
    let!(:path) { Rails.root.join("spec", "data", "ingestion", "ms_word", "example.docx") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let!(:text) { FactoryBot.create :text }
    let!(:section) { Ingestions::TextSection::Ingestor.run(ingestion: ingestion, text: text).result }

    it "returns a vaild text section" do
      expect(section).to be_valid
    end
  end

  context "when HTML" do
    let!(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let!(:text) { FactoryBot.create :text }
    let!(:text_section) { Ingestions::TextSection::Ingestor.run(ingestion: ingestion, text: text).result }

    it "returns a valid text" do
      expect(text_section).to be_valid
    end
  end

  context "when Markdown" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let!(:text) { FactoryBot.create :text }
    let!(:text_section) { Ingestions::TextSection::Ingestor.run(ingestion: ingestion, text: text).result }

    it "returns a valid text" do
      expect(text_section).to be_valid
    end
  end

  context "when Google Doc", slow: true do

    before(:all) do
      Settings.instance.update_from_environment!
    end

    let(:path) { "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing" }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, external_source_url: path }
    let!(:text) { FactoryBot.create :text }
    let!(:text_section) { Ingestions::TextSection::Ingestor.run(ingestion: ingestion, text: text).result }

    it "returns a valid text" do
      expect(text_section).to be_valid
    end
  end
end
