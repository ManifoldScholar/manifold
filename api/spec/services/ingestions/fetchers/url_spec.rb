require "rails_helper"

RSpec.describe Ingestions::Fetchers::URL do

  before(:each) do
    path =  Rails.root.join("spec", "data", "ingestion", "google-doc", "manifest.yml")
    @ingestion = FactoryBot.create(:ingestion)
    allow(@ingestion).to receive(:ingestion_source).and_return(path)
    @context = Ingestions::Context.new(@ingestion)
    @manifest = described_class.run(context: @context).result
  end

  after(:each) do
    @context.teardown
  end

  let(:expected) do
    {

    }
  end

  it "writes the file to ingestion working source dir" do
    expect(@context.sources).to_not be_empty
  end
end
