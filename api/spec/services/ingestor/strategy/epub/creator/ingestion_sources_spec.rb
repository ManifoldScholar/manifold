require "rails_helper"

# rubocop:disable Metrics/LineLength
RSpec.describe Ingestor::Strategy::EPUB::Creator::IngestionSources do
  let(:metadata_node) { File.open("#{Rails.root}/spec/data/epubs/fragments/metadata_node.xml") { |f| Nokogiri::XML(f) } }
  let(:manifest_items_node) { File.open("#{Rails.root}/spec/data/epubs/fragments/manifest_items_node.xml") { |f| Nokogiri::XML(f) } }
  let(:manifest_items) { manifest_items_node.xpath("//xmlns:item") }
  let(:ingestion_sources_creator) { Ingestor::Strategy::EPUB::Creator::IngestionSources.new(Rails.logger, metadata_node) }
  let(:fake_rendition_source) do
    file = StringIO.new("<body>Test</body>")
    filename = "a_file.html"
    metaclass = class << file; self; end
    metaclass.class_eval do
      define_method(:original_filename) { filename }
      define_method(:content_type) { "" }
    end
    return file
  end

  let(:epub_inspector) { double(Ingestor::Strategy::EPUB::Inspector, get_rendition_source: fake_rendition_source) }

  it "responds to logger methods" do
    expect(ingestion_sources_creator).to respond_to(:info)
    expect(ingestion_sources_creator).to respond_to(:debug)
    expect(ingestion_sources_creator).to respond_to(:error)
    expect(ingestion_sources_creator).to respond_to(:warn)
  end

  it "creates an ingestion source for each manifest item" do
    models = ingestion_sources_creator.create(manifest_items, "/test-tmp-path", epub_inspector)
    expect(!manifest_items.empty?).to be true
    expect(models.length).to eq manifest_items.length
  end

  it "updates existing objects rather than create new ones" do
    text = Text.new(unique_identifier: "1234")
    manifest_items.each do |item|
      item_inspector = Ingestor::Strategy::EPUB::Inspector::ManifestItem.new(item)
      text.ingestion_sources.build(source_identifier: item_inspector.id, kind: item_inspector.kind.presence)
    end
    models = ingestion_sources_creator.create(manifest_items, "/test-tmp-path", epub_inspector, text.ingestion_sources)
    expect(models.first).to eq(text.ingestion_sources.first)
  end

  it "creates new ingestion sources if none exist" do
    models = ingestion_sources_creator.create(manifest_items, "/test-tmp-path", epub_inspector, [])
    expect(models.length).to eq manifest_items.length
  end
end
