require "rails_helper"

RSpec.describe Ingestions::TextSection::Ingestor do
  shared_examples_for "a valid text section ingestion" do
    it "produces a text section" do
      expect do
        described_class.run!(ingestion: ingestion, text: text)
      end.to execute_safely.and change(TextSection, :count).by(1)
    end
  end

  context "when a Word Doc", slow: true do
    let!(:path) { Rails.root.join("spec", "data", "ingestion", "ms_word", "example.docx") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let!(:text) { FactoryBot.create :text }

    include_examples "a valid text section ingestion"
  end

  context "when HTML" do
    let!(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let!(:text) { FactoryBot.create :text }

    include_examples "a valid text section ingestion"
  end

  context "when Markdown" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let!(:text) { FactoryBot.create :text }

    include_examples "a valid text section ingestion"
  end

  context "when Google Doc", slow: true do

    before(:all) do
      Settings.instance.update_from_environment!
    end

    let(:path) { "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing" }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, external_source_url: path }
    let!(:text) { FactoryBot.create :text }

    include_examples "a valid text section ingestion"
  end
end
