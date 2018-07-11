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
        expect(text.result.valid?).to eq true
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
        expect(text.result.valid?).to eq true
      end
    end
  end

  describe "manifest ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

    it "returns a valid text" do
      expect(text.result.valid?).to eq true
    end
  end

  describe "document ingestion" do
    context "when HTML" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        allow(ingestion).to receive(:source_file_name).and_return("index.html")
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when Markdown" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single", "minimal-single.md") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        allow(ingestion).to receive(:source_file_name).and_return("minimal-single.md")
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when Google Doc", slow: true do
      let(:path) { "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing" }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end
  end
end
