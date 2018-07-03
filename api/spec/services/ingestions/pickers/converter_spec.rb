require "rails_helper"

RSpec.describe Ingestions::Pickers::Converter do

  context "when no converter is found" do
    let(:path) { "an/invalid/file.fail" }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { Ingestions::Context.new(ingestion) }
    let!(:outcome) { Ingestions::Pickers::Converter.run context: context, source_path: path }

    it "is not valid" do
      expect(outcome).to_not be_valid
    end
  end

  context "when Markdown" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single", "minimal-single.md") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { Ingestions::Context.new(ingestion) }
    let!(:outcome) { Ingestions::Pickers::Converter.run context: context, source_path: path.to_s }

    it "returns the correct converter" do
      expect(outcome.result.interaction).to eq Ingestions::Converters::Markdown
    end
  end

  context "when HTML" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { Ingestions::Context.new(ingestion) }
    let!(:outcome) { Ingestions::Pickers::Converter.run context: context, source_path: path.to_s }

    it "returns the correct converter" do
      expect(outcome.result.interaction).to eq Ingestions::Converters::Html
    end
  end

  # context "when GoogleDoc" do
  #   before(:all) do
  #     ingestion = nil
  #     context = Ingestions::Context.new(ingestion)
  #     @outcome = Ingestions::Pickers::Converter.run context: context
  #   end
  #
  #   it "returns the correct converter" do
  #     expect(@outcome.result).to be_a Ingestions::Converters::GoogleDoc
  #   end
  # end
end
