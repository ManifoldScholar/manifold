require "rails_helper"

RSpec.describe IngestionSource, type: :model do
  it "belongs to a text" do
    ingestion_source = IngestionSource.new
    text = Text.new
    ingestion_source.text = text
    expect(ingestion_source.text).to be text
  end

  it "belongs to a resource" do
    ingestion_source = IngestionSource.new
    resource = Resource.new
    ingestion_source.resource = resource
    expect(ingestion_source.resource).to be resource
  end
end
