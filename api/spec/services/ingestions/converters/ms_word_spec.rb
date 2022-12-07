require "rails_helper"

RSpec.describe Ingestions::Converters::MsWord do
  include TestHelpers::IngestionHelper

  describe "when ingesting doc with media assets" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "ms_word", "docs_with_media.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { create_context(ingestion) }

    before(:each) do
      @sources = Dir.glob(context.source_root + "/**/*.docx")
      @sources.each do |source|
        described_class.run context: context, source_path: context.rel(source)
      end
    end

    it "extracts media files to dirs matching source file name", odd_fs: true do
      @sources.each do |source|
        image_path = Pathname.new(File.join(context.source_root, File.basename(source, ".*"), "media", "1.jpeg"))
        expect(File.file?(image_path)).to eq true
      end
    end

    describe "the outputted html file" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "ms_word", "example.docx") }
      let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
      let(:context) { Ingestions::Context.new(ingestion) }
      let(:output) { Ingestions::Converters::MsWord.run context: context, source_path: context.rel(context.source_path) }
      let!(:parsed) { Nokogiri::HTML output.result }
      let(:media_tags) { parsed.xpath("//img | //image | //video | //audio") }

      it "relativizes the media tag src paths", odd_fs: true do
        srcs = media_tags.map { |tag| tag["src"] }
        expect(srcs.all? { |src| src.start_with? "/" }).to eq false
      end
    end
  end

end
