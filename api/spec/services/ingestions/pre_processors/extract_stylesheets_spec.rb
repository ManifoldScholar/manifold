require "rails_helper"

RSpec.describe Ingestions::PreProcessors::ExtractStylesheets do
  include TestHelpers::IngestionHelper

  describe "an EPUB ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2.zip") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) { Ingestions::Strategies::Epub.run(context: context).result }

    it "assigns the correct stylesheet attributes" do
      expected = [{"name"=>"stylesheet-1", "position"=>1, "hashed_content"=>"c47a911e406d63e16e29c5d7874f7397", "build"=>"build/stylesheet-1.css", "source_identifier"=>"/OEBPS/stylesheet.css"}]
      outcome = described_class.run(context: context, manifest: manifest)
      expect(outcome.result[:relationships][:stylesheets]).to eq expected
    end
  end

  describe "a document ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) { Ingestions::Strategies::Document.run(context: context).result }

    it "assigns the correct stylesheet attributes" do
      expected = [{"name"=>"stylesheet-1", "position"=>1, "hashed_content"=>"1826716b1ed8d8c12ba4e77ea2f1315b", "build"=>"build/stylesheet-1.css", "source_identifier"=>"a-stylesheet.css"},
                  {"name"=>"head-2", "position"=>2, "hashed_content"=>"10a71ed9947de85431b5a0b899305319", "build"=>"build/head-2.css", "source_identifier"=>nil}]
      outcome = described_class.run(context: context, manifest: manifest)
      expect(outcome.result[:relationships][:stylesheets]).to eq expected
    end
  end

  describe "a manifest ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) { Ingestions::Strategies::Manifest.run(context: context).result }

    it "assigns the correct stylesheet attributes" do
      expected = [{"name"=>"stylesheet-1", "position"=>1, "hashed_content"=>"1826716b1ed8d8c12ba4e77ea2f1315b", "build"=>"build/stylesheet-1.css", "source_identifier"=>"stylesheet.css"},
                  {"name"=>"head-2", "position"=>2, "hashed_content"=>"10a71ed9947de85431b5a0b899305319", "build"=>"build/head-2.css", "source_identifier"=>nil},
                  {"name"=>"stylesheet-3", "position"=>3, "hashed_content"=>"8f5a5eb6c412b3a978712a7a1c459844", "build"=>"build/stylesheet-3.css", "source_identifier"=>"markdown_styles.css"}]
      outcome = described_class.run(context: context, manifest: manifest)
      expect(outcome.result[:relationships][:stylesheets]).to eq expected
    end
  end
end
