require "rails_helper"

RSpec.describe Ingestions::Compiler do
  let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
  let(:ingestion) do
    ingestion = FactoryBot.create(:ingestion, text: nil)
    allow(ingestion).to receive(:ingestion_source).and_return(path)
    ingestion
  end
  let(:context) { Ingestions::Context.new(ingestion) }
  let(:manifest) { Ingestions::Strategies::Epub.run(context: context).result }

  it "creates the correct number of records" do
    expect do
      described_class.run(context: context, manifest: manifest)
    end.to change(Text, :count).by(1)
       .and change(TextSection, :count).by(4)
       .and change(TextTitle, :count).by(1)
       .and change(IngestionSource, :count).by(7)
       .and change(Maker, :count).by(1)
       .and change(Stylesheet, :count).by(1)
  end
end
