require "rails_helper"

RSpec.describe Ingestions::CreateManually do
  include TestHelpers::IngestionHelper
  let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
  let(:project) { FactoryBot.create(:project) }

  it "creates an ingestion" do
    expect do
      described_class.run project: project, source: File.open(path)
    end.to change { Ingestion.count }.by 1
  end

  describe "the resulting ingestion" do
    it "has a source file attached" do
      outcome = described_class.run project: project, source: File.open(path)
      expect(outcome.result.source).to_not be_nil
    end
  end
end
