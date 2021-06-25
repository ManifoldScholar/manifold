require "rails_helper"

RSpec.describe Ingestions::Compiler do
  include TestHelpers::IngestionHelper

  before(:all) do
    Settings.instance.update_from_environment!
  end

  describe "an epub ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Epub.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
    end

    it "sets the slug correctly" do
      outcome = described_class.run(context: context, manifest: manifest)
      expect(outcome.result.slug).to eq "your-title-here"
    end

    it "creates the correct number of records" do
      expect do
        described_class.run(context: context, manifest: manifest)
      end.to change(Text, :count).by(1)
        .and change(TextSection, :count).by(4)
        .and change(TextTitle, :count).by(1)
        .and change(IngestionSource, :count).by(7)
        .and change(Maker, :count).by(1)
        .and change(Stylesheet, :count).by(1)
    end
  end

  describe "a manifest ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "all_local.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Manifest.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
    end

    it "sets the slug correctly" do
      outcome = described_class.run(context: context, manifest: manifest)
      expect(outcome.result.slug).to eq "a-manifest-ingestion"
    end

    it "creates the correct number of records" do
      expect do
        described_class.run(context: context, manifest: manifest)
      end.to change(Text, :count).by(1)
        .and change(TextSection, :count).by(3)
        .and change(TextTitle, :count).by(1)
        .and change(IngestionSource, :count).by(6)
        .and change(Maker, :count).by(2)
        .and change(Stylesheet, :count).by(4)
    end
  end

  describe "an html document ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Document.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
    end

    it "sets the slug correctly" do
      outcome = described_class.run(context: context, manifest: manifest)
      expect(outcome.result.slug).to eq "title"
    end

    it "creates the correct number of records" do
      expect do
        described_class.run(context: context, manifest: manifest)
      end.to change(Text, :count).by(1)
        .and change(TextSection, :count).by(1)
        .and change(TextTitle, :count).by(1)
        .and change(IngestionSource, :count).by(1)
        .and change(Maker, :count).by(2)
        .and change(Stylesheet, :count).by(2)
    end
  end

  describe "a markdown document ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Document.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
    end

    it "sets the slug correctly" do
      outcome = described_class.run(context: context, manifest: manifest)
      expect(outcome.result.slug).to eq "title"
    end

    it "creates the correct number of records" do
      expect do
        described_class.run(context: context, manifest: manifest)
      end.to change(Text, :count).by(1)
        .and change(TextSection, :count).by(1)
        .and change(TextTitle, :count).by(1)
        .and change(IngestionSource, :count).by(2)
        .and change(Maker, :count).by(2)
        .and change(Stylesheet, :count).by(1)
    end
  end

  describe "a google doc document ingestion", slow: true do
    let(:path) { "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing" }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, external_source_url: path }
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Document.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
    end

    it "sets the slug correctly" do
      outcome = described_class.run(context: context, manifest: manifest)
      expect(outcome.result.slug).to eq "google-doc-prime"
    end

    it "creates the correct number of records" do
      expect do
        described_class.run(context: context, manifest: manifest)
      end.to change(Text, :count).by(1)
        .and change(TextSection, :count).by(1)
        .and change(TextTitle, :count).by(1)
        .and change(IngestionSource, :count).by(1)
        .and change(Maker, :count).by(0)
        .and change(Stylesheet, :count).by(2)
    end
  end
end
