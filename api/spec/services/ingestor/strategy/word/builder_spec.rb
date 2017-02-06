require "rails_helper"

RSpec.describe Ingestor::Strategy::Word::Builder do

  before(:each) do
    @creator = FactoryGirl.create(:user)
    path = File.join("spec", "data", "assets", "word_test")

    ingestion = Ingestor::Ingestion.new(path, @creator)
    strategy = Ingestor::Strategy.for(ingestion)

    id = strategy.unique_id(ingestion)
    text = Text.where(unique_identifier: id).first

    text ? ingestion.text = text : ingestion.text.unique_identifier = id

    strategy.ingest(ingestion)
    @text = ingestion.text
  end

  describe "the builder", :integration do

    it "successfully creates the text model" do
      expect(Text.all.count).to eq(1)
    end
  end

  context "the resulting text model", :integration do

    it "has a title" do
      expect(@text.title).to_not be_nil
    end

    it "has a publication date" do
      expect(@text.publication_date).to_not be_nil
    end

    it "generates a unique_id" do
      expect(@text.unique_identifier).to_not be_nil
    end

    it "associates the text with the creator" do
      expect(@text.creator).to eq(@creator)
    end

    it "has a collection of text sections" do
      assertion = @text.text_sections.all? { |source| source.kind_of? TextSection }
      expect(@text.text_sections.count).to be > 0
      expect(assertion).to be true
    end

    it "has a collection of stylesheets" do
      assertion = @text.stylesheets.all? { |source| source.kind_of? Stylesheet }
      expect(@text.stylesheets.count).to be > 0
      expect(assertion).to be true
    end

    it "has a collection of ingestion sources" do
      assertion = @text.ingestion_sources.all? { |source| source.kind_of? IngestionSource }
      expect(@text.ingestion_sources.count).to be > 0
      expect(assertion).to be true
    end

    it "has a spine with the text source" do
      expect(@text.spine).to be_a Array
      assertion = @text.spine.all? { |item| @text.text_sections.find(item).present? }
      expect(assertion).to be true
    end
  end
end
