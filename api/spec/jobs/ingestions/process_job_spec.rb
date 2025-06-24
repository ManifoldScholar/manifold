# frozen_string_literal: true

RSpec.describe Ingestions::ProcessJob, type: :job do
  let_it_be(:source_path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single.zip") }

  let_it_be(:ingestion, refind: true) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: }

  it "runs without issue" do
    expect do
      described_class.perform_now(ingestion, ingestion.creator)
    end.to execute_safely
      .and change(ingestion, :state).from("sleeping").to("finished")
      .and keep_the_same(ingestion, :processing_failed)
      .and change(Text, :count).by(1)

    # sanity check
    expect(ingestion).not_to be_processing_failed
  end

  context "with an ingestion that has a problematic source" do
    let_it_be(:ingestion, refind: true) { FactoryBot.create :ingestion }

    before do
      stub_request(:get, "http://example.com/index.md").
        to_return(status: 404, body: "", headers: {})
    end

    it "catches and logs the error" do
      expect do
        described_class.perform_now(ingestion, ingestion.creator)
      end.to execute_safely
        .and change(ingestion, :state).from("sleeping").to("finished")
        .and change(ingestion, :processing_failed).from(false).to(true)
        .and keep_the_same(Text, :count)
        .and change(IngestionMessage, :count).by_at_least(1)

      # sanity check
      expect(ingestion).to be_processing_failed
    end
  end
end
