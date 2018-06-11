require "rails_helper"

RSpec.describe Ingestions::Pickers::Strategy do

  context "when no strategy is found" do
    it "is not valid" do
      ingestion = FactoryBot.create(:ingestion)
      allow(ingestion).to receive(:ingestion_source).and_return("/some/path/and/file.txt")
      @context = Ingestions::Context.new(ingestion)

      outcome = Ingestions::Pickers::Strategy.run context: @context
      expect(outcome).to_not be_valid
    end
  end

  shared_examples_for "an ingestion strategy determination" do |path, expected|
    it "returns the correct strategy definition" do
      ingestion = FactoryBot.create(:ingestion)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      @context = Ingestions::Context.new(ingestion)

      @outcome = Ingestions::Pickers::Strategy.run context: @context
      expect(@outcome.result.name).to be expected
    end
  end

  context "when EPUB" do
    path = Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip")

    it_behaves_like "an ingestion strategy determination", path, :epub
  end

  context "when manifest" do
    path = Rails.root.join("spec", "data", "ingestion", "google-doc", "manifest.yml")

    it_behaves_like "an ingestion strategy determination", path, :manifest
  end

  context "when document" do
    path = Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html")

    it_behaves_like "an ingestion strategy determination", path, :document
  end
end
