require "rails_helper"

RSpec.describe Ingestions::Ingestor do
  describe "EPUB ingestion" do
    context "when V3" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.valid?).to eq true
      end
    end

    context "when V2" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.valid?).to eq true
      end
    end
  end

  describe "manifest ingestion" do

  end

  describe "document ingestion" do
    context "when HTML" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.valid?).to eq true
      end
    end

    context "when Markdown" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single", "minimal-single.md") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.valid?).to eq true
      end
    end
  end
end
