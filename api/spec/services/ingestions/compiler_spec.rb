require "rails_helper"

RSpec.describe Ingestions::Compiler do
  include TestHelpers::IngestionHelper

  describe "an epub ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Epub.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
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
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "all_local") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Manifest.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
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
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      allow(ingestion).to receive(:source_file_name).and_return("index.html")
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Document.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
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
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Document.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
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
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Document.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
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

  context "when reingesting" do
    let(:text) { FactoryBot.create(:text) }
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: text)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      allow(ingestion).to receive(:source_file_name).and_return("index.html")
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Document.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
    end

    describe "a successful compilation" do
      it "updates the existing text" do
        expect do
          described_class.run(context: context, manifest: manifest)
        end.to change(text, :updated_at)
      end
    end

    describe "a compilation with failures" do
      it "does not persist updates" do
        allow_any_instance_of(Ingestions::Compilers::TextSection).to receive(:text_section).and_raise(::Ingestions::IngestionError)
        manifest[:relationships][:text_titles] = [{ kind: ::TextTitle::KIND_MAIN, value: "Changed" }]

        expect do
          described_class.run(context: context, manifest: manifest)
        end.to_not change(text, :title)
      end
    end
  end
end
