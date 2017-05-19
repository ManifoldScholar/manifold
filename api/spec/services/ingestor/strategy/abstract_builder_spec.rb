require "rails_helper"

RSpec.describe Ingestor::Strategy::AbstractBuilder do

  before(:each) do
    @creator = FactoryGirl.create(:user)
    path = File.join("spec", "data", "assets", "gitbook_test", "original")

    ingestion = Ingestor::Ingestion.new(path, @creator)
    strategy = Ingestor::Strategy.for(ingestion)

    id = strategy.unique_id(ingestion)
    text = Text.where(unique_identifier: id).first

    text ? ingestion.text = text : ingestion.text.unique_identifier = id

    strategy.ingest(ingestion)
    @text = ingestion.text
  end

  describe "the builder", :integration do

    it "removes the unused text sections on update" do

      expect(@text.text_sections.count).to eq(2)

      @creator = FactoryGirl.create(:user)
      path = File.join("spec", "data", "assets", "gitbook_test", "modified")

      ingestion = Ingestor::Ingestion.new(path, @creator)
      strategy = Ingestor::Strategy.for(ingestion)

      id = strategy.unique_id(ingestion)
      text = Text.where(unique_identifier: id).first

      text ? ingestion.text = text : ingestion.text.unique_identifier = id

      strategy.ingest(ingestion)
      @text = ingestion.text

      expect(@text.text_sections.count).to eq(1)
    end
  end
end
