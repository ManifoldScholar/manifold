require "rails_helper"

RSpec.describe IngestionSource, type: :model do
  it "has a valid factory" do
    expect(FactoryGirl.build(:text_section)).to be_valid
  end

  it "belongs to a text" do
    ingestion_source = IngestionSource.new
    text = Text.new
    ingestion_source.text = text
    expect(ingestion_source.text).to be text
  end
end
