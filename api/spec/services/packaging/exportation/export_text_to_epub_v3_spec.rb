# frozen_string_literal: true

require "rails_helper"

RSpec.describe Packaging::Exportation::ExportTextToEpubV3, interaction: true, packaging: true do
  let!(:book_pipeline) { Packaging::EpubV3::BookCompilation::Pipeline.new }

  context "with an epub ingestion" do
    let!(:ingestion_source_path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: ingestion_source_path }
    let!(:ingestion_result) { Ingestions::Ingestor.run ingestion: ingestion }
    let!(:text) { ingestion_result.valid? ? ingestion_result.result : nil }

    it "compiles a book and marks the export successful" do
      expect do
        @outcome = described_class.run text: text
      end.to execute_safely.and change(TextExport, :count).by(1)

      expect(@outcome).to be_valid
      expect(@outcome.result).to be_success
    end

    it "records the failure and disables the toggle when compilation fails" do
      text.update! exports_as_epub_v3: true

      call_result = double("matcher result")

      expect(call_result).to receive(:success).once
      expect(call_result).to receive(:failure).once.and_yield([:failed_export, "the raw underlying detail"])

      expect(book_pipeline).to receive_message_chain(:with_step_args, :call).and_yield(call_result)

      allow_any_instance_of(described_class).to receive(:book_pipeline).and_return(book_pipeline)

      expect do
        @outcome = described_class.run text: text
      end.to execute_safely.and change(TextExport, :count).by(1)

      aggregate_failures do
        expect(@outcome).to be_valid
        expect(text.reload).not_to be_exports_as_epub_v3

        export = @outcome.result.reload

        expect(export).to be_failure
        expect(export.metadata).to include(
          "code" => "failed_export",
          "reason" => "The generated EPUB could not be saved.",
          "detail" => "the raw underlying detail"
        )
      end
    end

    it "composes an actionable reason from a failed remote resource, keeping raw cause in detail" do
      call_result = double("matcher result")

      expect(call_result).to receive(:success).once
      expect(call_result).to receive(:failure).once.and_yield(
        [:socket_error, { url: "https://example.com/missing.png", cause: "getaddrinfo: nodename nor servname provided" }]
      )

      expect(book_pipeline).to receive_message_chain(:with_step_args, :call).and_yield(call_result)

      allow_any_instance_of(described_class).to receive(:book_pipeline).and_return(book_pipeline)

      @outcome = described_class.run text: text

      export = @outcome.result.reload

      aggregate_failures do
        expect(export.metadata["code"]).to eq "socket_error"
        expect(export.metadata["reason"]).to include("https://example.com/missing.png", "publicly accessible")
        expect(export.metadata["detail"]).to eq "getaddrinfo: nodename nor servname provided"
      end
    end

    it "retries a previously failed export" do
      text_export = TextExport.find_or_initialize_for_epub_v3 text
      text_export.save!
      text_export.transition_to! :processing
      text_export.transition_to! :failure

      expect do
        @outcome = described_class.run text: text
      end.to execute_safely.and keep_the_same(TextExport, :count)

      expect(@outcome.result).to be_success
    end
  end
end
