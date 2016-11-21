require "rails_helper"

RSpec.describe Ingestor::Creator::IngestionSources do

  def double_builder(num)
    double("Inspector",
           source_identifier: num,
           source_path: "/#{num}",
           kind: IngestionSource::KIND_SECTION,
           attachment: nil
    )
  end

  let(:text) { FactoryGirl.create(:text) }
  let(:creator) { Ingestor::Creator::IngestionSources.new(Rails.logger, text) }
  let(:inspectors) { [
    double_builder("1"),
    double_builder("2"),
    double_builder("3")
  ]}

  it "responds to logger methods" do
    expect(creator).to respond_to(:info)
    expect(creator).to respond_to(:debug)
    expect(creator).to respond_to(:error)
    expect(creator).to respond_to(:warn)
  end

  it "creates an ingestion source for each inspector" do
    models = creator.create(inspectors)
    expect(models.length).to eq(inspectors.length)
  end

  it "updates existing objects rather than create new ones" do
    FactoryGirl.create(:ingestion_source, text: text, source_identifier: "1")
    FactoryGirl.create(:ingestion_source, text: text, source_identifier: "2")
    FactoryGirl.create(:ingestion_source, text: text, source_identifier: "3")
    models = creator.create(inspectors, text.ingestion_sources)
    models.each(&:save)
    expect(text.ingestion_sources.count).to eq 3
    expect(text.ingestion_sources.pluck(:id)).to match_array models.pluck(:id)
  end

end
