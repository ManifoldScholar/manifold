require "rails_helper"

RSpec.describe Ingestor::Creator::IngestionSources do

  def double_builder(path)
    double("Inspector",
           source_identifier: path,
           source_path: path,
           kind: IngestionSource::KIND_SECTION,
           attachment: nil
    )
  end

  let(:text) { FactoryBot.create(:text) }
  let(:creator) { Ingestor::Creator::IngestionSources.new(Rails.logger, text) }
  let(:inspectors) { [
    double_builder("/1"),
    double_builder("/2"),
    double_builder("/3")
  ]}

  it "doesn't try to attach a file for remote sources" do
    uri = "https://s3-eu-west-1.amazonaws.com/bucket/path/object.mp4"
    inspectors = [
      double_builder(uri)
    ]
    models = creator.create(inspectors)
    expect(models.first.source_path).to eq uri
  end

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
    FactoryBot.create(:ingestion_source, text: text, source_identifier: "/1")
    FactoryBot.create(:ingestion_source, text: text, source_identifier: "/2")
    FactoryBot.create(:ingestion_source, text: text, source_identifier: "/3")
    models = creator.create(inspectors, text.ingestion_sources)
    models.each(&:save)
    expect(text.ingestion_sources.count).to eq 3
    expect(text.ingestion_sources.pluck(:id)).to match_array models.pluck(:id)
  end

end
