require "rails_helper"

RSpec.describe Ingestions::Converters::HTML do
  let(:path) { nil }
  let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let(:context) { Ingestions::Context.new(ingestion) }
  let(:output) { Ingestions::Converters::HTML.run context: context, source_path: context.rel(context.source_path) }
  let(:parsed) { Nokogiri::HTML(output.result) }

  describe "when ingesting html with inline styles" do

    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "with_inline_styles", "index.html") }

    it "has a style tag with the extracted inline styles assigned to classes" do
      styles = parsed.at("//style")
      expected = ".extracted-inline-style-1 { font-weight: bold; } .extracted-inline-style-2 { text-decoration: underline; }"
      expect(styles.children.to_s.squish).to eq expected
    end

    it "replaces inline styles with classes" do
      spans = parsed.search("//span")
      expected = %w(extracted-inline-style-1 extracted-inline-style-1 extracted-inline-style-2)
      expect(spans.map { |span| span.attributes["class"].value }).to eq expected
    end
  end

  describe "when ingesting html with non-latin characters" do

    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "non_latin", "index.html") }

    it "has the correct content" do
      paragraphs = parsed.xpath("//p")
      expected = "Είναι πλέον"
      paragraphs.each do |paragraph|
        expect(paragraph.text.strip).to eq expected
      end
    end

  end

  describe "when ingesting html with headers that do not have IDs" do

    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "without_header_ids", "index.html") }
    let(:headers) { parsed.xpath("//h1 | //h2 | //h3 | //h4 | //h5 | //h6") }

    it "adds an ID to every header tag" do
      headers.each do |header, index|
        expect(header["id"].blank?).to be false
      end
    end

    it "generates unique header tags, even when contents are the same" do
      ids = headers.map { |header| header["id"] }
      expect(ids.length > 0).to be true
      expect(ids.uniq.length).to eq ids.length
    end

  end


end
