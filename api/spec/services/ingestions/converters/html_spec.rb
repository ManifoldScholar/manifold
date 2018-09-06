require "rails_helper"

RSpec.describe Ingestions::Converters::Html do
  let(:ingestion) do
    ingestion = FactoryBot.create(:ingestion, text: nil)
    allow(ingestion).to receive(:ingestion_source).and_return(path)
    ingestion
  end
  let(:context) { Ingestions::Context.new(ingestion) }
  let(:output) { Ingestions::Converters::Html.run context: context, source_path: context.rel(context.source_path) }
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


end
