require "rails_helper"

RSpec.describe Packaging::EpubV3::BookCompilation::Pipeline, packaging: true do
  let!(:pipeline) { described_class.new }

  context "with an epub ingestion" do
    let!(:ingestion_source_path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: ingestion_source_path }
    let!(:ingestion_result) { Ingestions::Ingestor.run ingestion: ingestion }
    let!(:text) { ingestion_result.valid? ? ingestion_result.result : nil }

    it "compiles a book" do
      expect do
        @result = pipeline.call text
      end.to execute_safely.and change(TextExport, :count).by(1)

      expect(@result).to be_a_success
    end
  end
end
