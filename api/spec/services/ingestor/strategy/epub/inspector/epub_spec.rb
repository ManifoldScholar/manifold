require "rails_helper"

# rubocop:disable Metrics/LineLength
RSpec.describe Ingestor::Strategy::EPUB::Inspector::EPUB do

  before(:all) do
    @creator = FactoryBot.create(:user)
  end

  describe "when the source is not utf-8 encoded" do

    before(:all) do
      @source_path =
        Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3-utf8")
      @ingestion = Ingestor::Ingestion.new(@source_path, @creator)
      @inspector = Ingestor::Strategy::EPUB::Inspector::EPUB.new(@ingestion)
    end

    it "returns the version" do
      expect(@inspector.epub_version).to eq "3.0"
    end

    it "returns the rendition path" do
      expect(@inspector.send :rendition_path).to eq "OEBPS/content.opf"
    end

  end

  describe "when the source is ASCII encoded" do

    before(:all) do
      @source_path =
        Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3")
      @ingestion = Ingestor::Ingestion.new(@source_path, @creator)
      @inspector = Ingestor::Strategy::EPUB::Inspector::EPUB.new(@ingestion)
    end

    it "returns the version" do
      expect(@inspector.epub_version).to eq "3.0"
    end

    it "returns the rendition path" do
      expect(@inspector.send :rendition_path).to eq "EPUB/package.opf"
    end

  end

end
