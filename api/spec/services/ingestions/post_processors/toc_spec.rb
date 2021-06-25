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

  let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let!(:context) { create_context(ingestion) }
  let(:manifest) do
    manifest = strategy.run(context: context).result
    manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
    manifest
  end
  let!(:text) { Ingestions::Compiler.run(manifest: manifest, context: context).result }


  describe "an epub ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
    let(:strategy) { Ingestions::Strategies::Epub }
    let(:hashed) { text.toc.detect { |item| item["label"] == "Section 2#1" } }
    let(:unhashed) { text.toc.detect { |item| item["label"] == "Section 2" } }

    include_examples "toc items"
  end

  describe "a manifest ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "all_local.zip") }
    let(:strategy) { Ingestions::Strategies::Manifest }
    let(:hashed) { text.toc.detect { |item| item["label"] == "Section 1#1" } }
    let(:unhashed) { text.toc.detect { |item| item["label"] == "Title Set From TOC" } }

    include_examples "toc items"
  end

  describe "a document ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "structured.zip") }
    let(:strategy) { Ingestions::Strategies::Document }
    let(:hashed) { text.toc.detect { |item| item["label"] == "Header 2" } }

    before(:each) { described_class.run text: text, context: context }

    context "when item has hash" do
      it "has the right anchor" do
        expect(hashed["anchor"]).to eq "header-2"
      end
    end
  end
end
