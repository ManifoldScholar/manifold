require "rails_helper"

RSpec.describe Ingestions::PostProcessors::TextSectionBody do
  include TestHelpers::IngestionHelper

  let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "encoded_path.zip") }
  let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let!(:context) { create_context(ingestion) }
  let(:manifest) do
    manifest = Ingestions::Strategies::Document.run(context: context).result
    manifest = Ingestions::PreProcessor.run(context: context, manifest: manifest).result
    manifest
  end
  let!(:text) { Ingestions::Compiler.run(manifest: manifest, context: context).result }
  let!(:text_section) { text.text_sections.first }

  it "correctly maps an html encoded path to a string path" do
    expect do
      described_class.run text: text, text_section: text_section, context: context
    end.to change { text_section.body }

    image = Nokogiri::HTML.fragment(text_section.body).at("img")
    source = text.ingestion_sources.find_by(source_path: "images/an image.png")
    expect(image.attributes["src"].value).to eq source.proxy_path
  end

end
