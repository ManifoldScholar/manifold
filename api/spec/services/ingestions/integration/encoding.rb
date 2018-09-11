require "rails_helper"

RSpec.describe "When ingesting document with varying character encoding", integration: true do
  include TestHelpers::IngestionHelper

  context "when non-latin HTML" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "non_latin", "index.html") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      allow(ingestion).to receive(:source_file_name).and_return("index.html")
      ingestion
    end
    let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

    it "does not unnecessarily change non-latin text" do
      compare = "<div><p>Είναι πλέον</p><p>Είναι πλέον</p></div>"
      expect(text.result.text_sections.first.body).to eq_ignoring_whitespace compare
    end
  end

  context "when source includes special characters" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "special-characters.md") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      allow(ingestion).to receive(:source_file_name).and_return("curly-quotes.md")
      ingestion
    end
    let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

    it "does not change the characters" do
      compare = "<div><p>· This £ ¢ document “has” ‘many’ special character§.</p></div>"
      expect(text.result.text_sections.first.body).to eq_ignoring_whitespace compare
    end
  end

end
