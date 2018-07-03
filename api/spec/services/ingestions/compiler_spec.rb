require "rails_helper"

RSpec.describe Ingestions::Compiler do
  describe "an epub ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { Ingestions::Context.new(ingestion) }
    let(:manifest) { Ingestions::Strategies::Epub.run(context: context).result }

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
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { Ingestions::Context.new(ingestion) }
    let(:manifest) { Ingestions::Strategies::Manifest.run(context: context).result }

    it "creates the correct number of records" do
      expect do
        described_class.run(context: context, manifest: manifest)
      end.to change(Text, :count).by(1)
               .and change(TextSection, :count).by(3)
                      .and change(TextTitle, :count).by(1)
                             .and change(IngestionSource, :count).by(5)
                                    .and change(Maker, :count).by(2)
                                           .and change(Stylesheet, :count).by(3)
    end
  end

  describe "an html document ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { Ingestions::Context.new(ingestion) }
    let(:manifest) { Ingestions::Strategies::Document.run(context: context).result }

    it "creates the correct number of records" do
      expect do
        described_class.run(context: context, manifest: manifest)
      end.to change(Text, :count).by(1)
               .and change(TextSection, :count).by(1)
                      .and change(TextTitle, :count).by(1)
                             .and change(IngestionSource, :count).by(1)
                                    .and change(Maker, :count).by(2)
                                           .and change(Stylesheet, :count).by(1)
    end
  end

  describe "a markdown document ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single", "minimal-single.md") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { Ingestions::Context.new(ingestion) }
    let(:manifest) { Ingestions::Strategies::Document.run(context: context).result }

    it "creates the correct number of records" do
      expect do
        described_class.run(context: context, manifest: manifest)
      end.to change(Text, :count).by(1)
               .and change(TextSection, :count).by(1)
                      .and change(TextTitle, :count).by(1)
                             .and change(IngestionSource, :count).by(1)
                                    .and change(Maker, :count).by(2)
                                           .and change(Stylesheet, :count).by(0)
    end
  end

  describe "a google doc document ingestion", slow: true do
    let(:path) { "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing" }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { Ingestions::Context.new(ingestion) }
    let(:manifest) { Ingestions::Strategies::Document.run(context: context).result }

    it "creates the correct number of records" do
      expect do
        described_class.run(context: context, manifest: manifest)
      end.to change(Text, :count).by(1)
               .and change(TextSection, :count).by(1)
                      .and change(TextTitle, :count).by(1)
                             .and change(IngestionSource, :count).by(2)
                                    .and change(Maker, :count).by(0)
                                           .and change(Stylesheet, :count).by(1)
    end
  end
end
