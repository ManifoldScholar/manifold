require "rails_helper"

RSpec.describe Packaging::Exportation::ExportTextToEpubV3, interaction: true, packaging: true do
  let!(:book_pipeline) { Packaging::EpubV3::BookCompilation::Pipeline.new }

  context "with an epub ingestion" do
    let!(:ingestion_source_path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: ingestion_source_path }
    let!(:ingestion_result) { Ingestions::Ingestor.run ingestion: ingestion }
    let!(:text) { ingestion_result.valid? ? ingestion_result.result : nil }

    it "compiles a book" do
      expect do
        @outcome = described_class.run text: text
      end.to execute_safely.and change(TextExport, :count).by(1)

      expect(@outcome).to be_valid
    end

    it "handles failures" do
      call_result = double("matcher result")

      expect(call_result).to receive(:success).once
      expect(call_result).to receive(:failure).once.and_yield("some arbitrary reason")

      expect(book_pipeline).to receive_message_chain(:with_step_args, :call).and_yield(call_result)

      allow_any_instance_of(described_class).to receive(:book_pipeline).and_return(book_pipeline)

      expect do
        @outcome = described_class.run text: text
      end.to execute_safely.and keep_the_same(TextExport, :count)

      expect(@outcome).to be_invalid

      expect(@outcome).to have(1).error_on(:base)
    end
  end
end
