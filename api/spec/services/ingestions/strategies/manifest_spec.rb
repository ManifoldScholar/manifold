require "rails_helper"

RSpec.describe Ingestions::Strategies::Manifest do

  before(:each) do
    @path =  Rails.root.join("spec", "data", "ingestion", "google-doc", "manifest.yml")
    @ingestion = FactoryBot.create(:ingestion)
    allow(@ingestion).to receive(:ingestion_source).and_return(@path)
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

  it "sets the ingestion type to manifest" do
    expect(@context.ingestion.ingestion_type).to eq "manifest"
  end

  # it "returns a manifest object" do
  #   expect(outcome.result).to eq expected
  # end
end
