require "rails_helper"

RSpec.shared_examples "toc items" do
  before(:each) { described_class.run text: text, context: context }

  context "when item has hash" do
    it "has the right anchor" do
      expect(hashed["anchor"]).to eq "1"
    end
  end

  context "when item does not have hash" do
    it "has the right anchor" do
      expect(unhashed["anchor"]).to eq nil
    end
  end

  context "when multiple items share text section" do
    it "have the same text section id" do
      expect(hashed["id"]).to eq unhashed["id"]
    end
  end
end

RSpec.describe Ingestions::PostProcessors::TOC do
  include TestHelpers::IngestionHelper

  describe "an epub ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let!(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Epub.run! context: context
      manifest = Ingestions::PreProcessor.run! context: context, manifest: manifest
      manifest
    end
    let!(:text) { Ingestions::Compiler.run! manifest: manifest, context: context }
    let(:hashed) { text.toc.detect { |item| item["label"] == "Section 2#1" } }
    let(:unhashed) { text.toc.detect { |item| item["label"] == "Section 2" } }

    include_examples "toc items"
  end

  describe "a manifest ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "all_local") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let!(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Manifest.run! context: context
      manifest = Ingestions::PreProcessor.run! context: context, manifest: manifest
      manifest
    end
    let!(:text) { Ingestions::Compiler.run! manifest: manifest, context: context }
    let(:hashed) { text.toc.detect { |item| item["label"] == "Section 1#1" } }
    let(:unhashed) { text.toc.detect { |item| item["label"] == "Title Set From TOC" } }

    include_examples "toc items"
  end

  describe "a document ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "structured") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let!(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Document.run! context: context
      manifest = Ingestions::PreProcessor.run! context: context, manifest: manifest
      manifest
    end
    let!(:text) { Ingestions::Compiler.run! manifest: manifest, context: context }
    let(:hashed) { text.toc.detect { |item| item["label"] == "Header 2" } }

    before(:each) { described_class.run text: text, context: context }

    context "when item has hash" do
      it "has the right anchor" do
        expect(hashed["anchor"]).to eq "header-2"
      end
    end
  end
end
