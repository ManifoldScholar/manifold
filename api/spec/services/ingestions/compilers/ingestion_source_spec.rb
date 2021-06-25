require "rails_helper"

RSpec.describe Ingestions::Compiler do
  include TestHelpers::IngestionHelper
  let(:logger_target) { StringIO.new }
  let(:logger) { Logger.new(logger_target) }
  let(:context) { create_context(ingestion, logger) }
  let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "with_ds_store.zip") }
  let(:extracted_path) { Rails.root.join("spec", "data", "ingestion", "manifest", "with_ds_store") }
  let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let(:text) { FactoryBot.create(:text) }
  let(:outcome) do
    Ingestions::Compilers::IngestionSource.run(
      text: text,
      manifest: {},
      attributes: attributes,
      context: context
    )
  end

  context "when the ingestion source is a valid attachment" do
    let(:attributes) do
      {
        "source_identifier" => "82bf1a14c3653b352525e73d280dd3d8",
        "source_path" => "stylesheet.css",
        "kind" => "publication_resource",
        "attachment" => File.open(File.join(extracted_path, "stylesheet.css"))
      }
    end

    it "returns an valid result" do
      expect(outcome.valid?).to be true
    end
  end

  context "when the ingestion source is not a valid attachment" do
    let(:attributes) do
      {
        "source_identifier" => "82bf1a14c3653b352525e73d280dd3d8",
        "source_path" => "_DS_Store",
        "kind" => "publication_resource",
        "attachment" => File.open(File.join(extracted_path, "_DS_Store"))
      }
    end

    it "still returns a valid result" do
      expect(outcome.valid?).to be true
    end

    it "includes a warning when the ingestion source is not valid" do
      outcome
      expect(logger_target.string.blank?).to be false
    end
  end
end
