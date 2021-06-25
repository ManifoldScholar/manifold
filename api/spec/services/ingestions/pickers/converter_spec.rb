require "rails_helper"

RSpec.describe Ingestions::Pickers::Converter do

  context "when no converter is found" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2.epub") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { Ingestions::Context.new(ingestion) }
    let!(:outcome) { Ingestions::Pickers::Converter.run context: context, source_path: path }

    it "is not valid" do
      expect(outcome).to_not be_valid
    end
  end

  context "when Markdown" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single", "minimal-single.md") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { Ingestions::Context.new(ingestion) }
    let!(:outcome) { Ingestions::Pickers::Converter.run context: context, source_path: path.to_s }

    it "returns the correct converter" do
      expect(outcome.result.interaction).to eq Ingestions::Converters::Markdown
    end
  end

  context "when HTML" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let(:context) { Ingestions::Context.new(ingestion) }
    let!(:outcome) { Ingestions::Pickers::Converter.run context: context, source_path: path.to_s }

    it "returns the correct converter" do
      expect(outcome.result.interaction).to eq Ingestions::Converters::HTML
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
