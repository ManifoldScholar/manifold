require "rails_helper"

RSpec.describe Ingestions::PostProcessors::SetStartSection do
  include TestHelpers::IngestionHelper

  shared_examples_for "the start section assignment" do |section_name|

    before(:each) { described_class.run(manifest: manifest, text: text, context: context) }

    it "determines the start_text_section_id" do
      expect(text.start_text_section).to_not be_nil
      expect(text.start_text_section.name).to eq section_name
    end
  end

  context "when manifest" do
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Manifest.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
    end
    let!(:text) { Ingestions::Compiler.run(manifest: manifest, context: context).result }

    context "when starting section source is referenced multiple times" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "all_local.zip") }

      include_examples "the start section assignment", "Title Set From TOC"
    end

    context "when starting section is a child of another section" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "child_start_section.zip") }

      include_examples "the start section assignment", "The Start Section"
    end
  end

  context "when epub" do
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { create_context(ingestion) }
    let(:manifest) do
      manifest = Ingestions::Strategies::Epub.run(context: context).result
      manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
      manifest
    end
    let!(:text) { Ingestions::Compiler.run(manifest: manifest, context: context).result }

    context "when V2" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2.zip") }

      include_examples "the start section assignment", "Section 2"
    end

    context "when V3" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }

      include_examples "the start section assignment", "Section 2"
    end
  end

end
