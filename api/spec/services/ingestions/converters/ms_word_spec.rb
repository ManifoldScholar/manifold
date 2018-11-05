require "rails_helper"

RSpec.describe Ingestions::Converters::MsWord do
  let(:ingestion) do
    ingestion = FactoryBot.create(:ingestion, text: nil)
    allow(ingestion).to receive(:ingestion_source).and_return(path)
    ingestion
  end
  let(:context) { Ingestions::Context.new(ingestion) }
  let(:output) { Ingestions::Converters::MsWord.run context: context, source_path: context.rel(context.source_path) }
  let!(:parsed) { Nokogiri::HTML output.result }

  describe "when ingesting doc with media assets" do

    let(:path) { Rails.root.join("spec", "data", "ingestion", "ms_word", "example.docx") }
    let(:media_tags) { parsed.xpath("//img | //image | //video | //audio") }

    it "extracts the media files to source dir" do
      expect(context.sources.length).to eq 1
    end

    it "relativizes the media tag src paths" do
      srcs = media_tags.map { |tag| tag["src"] }
      expect(srcs.all? { |src| src.start_with? "/" }).to eq false
    end

  end


end
