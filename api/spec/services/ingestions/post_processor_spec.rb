require "rails_helper"

RSpec.describe Ingestions::PostProcessor do
  include TestHelpers::IngestionHelper

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
  let!(:text) { Ingestions::Compiler.run(manifest: manifest, context: context).result }
  let!(:outcome) { Ingestions::PostProcessor.run(manifest: manifest, text: text, context: context) }

  describe "the text section bodies" do
    it "generates the body" do
      expect(text.text_sections.pluck(:body)).to_not include nil
    end
    it "generates the body_json" do
      expect(text.text_sections.pluck(:body_json)).to_not include nil
    end
  end

  describe "the text spine" do
    it "correctly generates a spine" do
      expect(text.spine.length).to eq 4
    end
  end

  describe "the text table of contents" do
    it "has the correct number of entries" do
      toc = text.toc
      expect(toc.length).to be 3
      expect(toc[1][:children].length).to be 1
    end

    it "has the correct labels" do
      toc = text.toc
      expect(toc.map { |i| i[:label] }).to eq ["Section 1", "Section 2", "Section 3"]
      expect(toc[1][:children][0][:label]).to eq "Section 2.a"
    end

    it "assigns a text_section ID to each item" do
      def walk(array)
        ids = []
        array.each do |hash|
          ids.push hash[:id]
          if hash.key? :children
            ids.concat walk(hash[:children])
          end
        end
        ids
      end
      expect(walk(text.toc).any? { |i| i.nil? }).to be false
    end
  end

  describe "compiled files that are unreferenced" do
    let!(:user_stylesheet) { FactoryBot.create(:stylesheet, text: text) }

    let(:after_path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3-less.zip") }
    let(:after_source) { File.open(after_path) }
    let(:after_ingestion) do
      after_ingestion = FactoryBot.create(:ingestion, text: text)
      allow(after_ingestion).to receive(:ingestion_source).and_return(after_path)
      after_ingestion
    end
    let(:reingestion_context) { create_context(after_ingestion) }
    let(:reingestion_manifest) do
      reingestion_manifest = Ingestions::Strategies::Epub.run(context: reingestion_context).result
      reingestion_manifest = Ingestions::PreProcessor.run(context: reingestion_context, manifest: reingestion_manifest).result
      reingestion_manifest
    end
    let!(:after_text) { Ingestions::Compiler.run(manifest: reingestion_manifest, context: reingestion_context).result }

    context "when text sections" do
      it "destroys the compiled records" do
        expect { described_class.run(manifest: reingestion_manifest, text: after_text, context: context) }.to change { TextSection.count }.by -1
      end
    end

    context "when stylesheets" do
      it "destroys the compiled records" do
        expect { described_class.run(manifest: reingestion_manifest, text: after_text, context: context) }.to change { Stylesheet.count }.by -1
      end

      it "does not destroy user created stylesheets" do
        expect(Stylesheet.find(user_stylesheet.id)).to be_present
      end
    end
  end
end
