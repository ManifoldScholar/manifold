# frozen_string_literal: true

RSpec.describe Ingestions::PostProcessor do
  include TestHelpers::IngestionHelper

  let_it_be(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
  let_it_be(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let_it_be(:context) { create_context(ingestion) }
  let_it_be(:manifest) do
    Ingestions::Strategies::Epub.run(context: context).result.then do |manifest|
      Ingestions::PreProcessor.run(context: context, manifest: manifest).result
    end
  end
  let_it_be(:text) { Ingestions::Compiler.run(manifest: manifest, context: context).result }
  let_it_be(:outcome) { Ingestions::PostProcessor.run(manifest: manifest, text: text, context: context) }

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
      expect(toc.length).to be 4
      expect(toc[1][:children].length).to be 1
    end

    it "has the correct labels" do
      toc = text.toc
      expect(toc.map { |i| i[:label] }).to eq ["Section 1", "Section 2", "Section 2#1", "Section 3"]
      expect(toc[1][:children][0][:label]).to eq "Section 2.a"
    end

    it "assigns a text_section ID to each item" do
      expect(walk(text.toc).any? { |i| i.nil? }).to be false
    end

    def walk(entries)
      entries.each_with_object([]) do |entry, ids|
        ids.push entry.id

        ids.concat walk(entry.children) if entry.children.present?
      end
    end
  end

  describe "compiled files that are unreferenced" do
    let_it_be(:user_stylesheet) { FactoryBot.create(:stylesheet, text: text) }

    let_it_be(:after_path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3-less.zip") }
    let_it_be(:after_source) { File.open(after_path) }
    let_it_be(:after_ingestion) { FactoryBot.create :ingestion, :file_source, text: text, source_path: after_path }
    let_it_be(:reingestion_context) { create_context(after_ingestion) }
    let_it_be(:reingestion_manifest) do
      Ingestions::Strategies::Epub.run(context: reingestion_context).result.then do |reingestion_manifest|
        Ingestions::PreProcessor.run(context: reingestion_context, manifest: reingestion_manifest).result
      end
    end
    let_it_be(:after_text) { Ingestions::Compiler.run(manifest: reingestion_manifest, context: reingestion_context).result }

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
        expect do
          user_stylesheet.reload
        end.to execute_safely
      end
    end
  end
end
