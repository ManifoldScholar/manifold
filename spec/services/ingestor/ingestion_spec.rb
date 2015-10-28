require "rails_helper"

RSpec.describe Ingestor::Ingestion do
  let(:epub_source_path) { "spec/data/epubs/v3/childrens-literature.epub" }

  it "should raise an error if a path is not passed to the constructor" do
    expect do
      Ingestor::Ingestion.new
    end.to raise_error
  end

  it "should allow access to the source file extension" do
    ingestion = Ingestor::Ingestion.new(epub_source_path)
    expect(ingestion.extension).to eq "epub"
  end

  it "should allow access to the source_path" do
    ingestion = Ingestor::Ingestion.new(epub_source_path)
    expect(ingestion.source_path).to eq epub_source_path
  end

  it "should return the first available strategy for the source" do
  end
end
