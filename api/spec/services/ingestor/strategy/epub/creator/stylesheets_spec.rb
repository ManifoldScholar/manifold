require "rails_helper"

# rubocop:disable Metrics/LineLength
RSpec.describe Ingestor::Strategy::EPUB::Creator::Stylesheets do
  let(:metadata_node) { File.open("#{Rails.root}/spec/data/epubs/fragments/metadata_node.xml") { |f| Nokogiri::XML(f) } }

  let(:manifest_items_node) do
    xml = '
    <?xml version="1.0" encoding="utf-8" standalone="no"?>
    <package xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/"
             xmlns:dcterms="http://purl.org/dc/terms/" version="3.0" xml:lang="en"
             unique-identifier="pub-identifier">
        <manifest>
            <item id="css-002"  href="css/css_file_1.css" media-type="text/css" />
            <item id="css-003"  href="css/css_file_2.css" media-type="text/css" />
            <item id="id-id2644001" href="ch03s04.xhtml" media-type="application/xhtml+xml"/>
        </manifest>
    </package>
    '
    Nokogiri::XML(xml)
  end

  let(:manifest_items) { manifest_items_node.xpath("//xmlns:item") }
  let(:stylesheets_creator) { Ingestor::Strategy::EPUB::Creator::Stylesheets.new(Rails.logger, metadata_node) }
  let(:sample_css) do
    "
      body {
        font-weight: bold;
      }
    "
  end
  let(:path) { "/test-tmp-path" }
  let(:ingestion_sources) do
    [
      IngestionSource.new(source_identifier: "css-002")
    ]
  end
  let(:text) { Text.new(ingestion_sources: ingestion_sources) }
  let(:models) { stylesheets_creator.create(manifest_items, path, epub_inspector, text, text.stylesheets) }

  let(:fake_rendition_source) do
    file = StringIO.new(sample_css)
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
    expect(stylesheets_creator).to respond_to(:info)
    expect(stylesheets_creator).to respond_to(:debug)
    expect(stylesheets_creator).to respond_to(:error)
    expect(stylesheets_creator).to respond_to(:warn)
  end

  it "creates a stylesheet for each manifest item with a css extension" do
    expect(!manifest_items.empty?).to be true
    expect(models.length).to eq 2 # One of the nodes above is not a CSS node
  end

  it "saves the stylesheet source to raw_styles" do
    expect(models.first.raw_styles).to eq sample_css
  end

  it "assigns a name based on the manifest item ID" do
    expect(models.first.name).to eq "source/#{path}/css-002"
  end

  it "associates the stylesheet with the corresponding ingestion source" do
    expect(models.first.ingestion_source).to be_an_instance_of IngestionSource
    expect(models.first.ingestion_source).to be ingestion_sources.first
  end

  it "associates the stylesheet no ingestion source if the source does not exist" do
    expect(models.last.ingestion_source).to be nil
  end
end
