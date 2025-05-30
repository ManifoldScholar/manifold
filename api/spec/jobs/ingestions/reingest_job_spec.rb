# frozen_string_literal: true

RSpec.describe Ingestions::ReingestJob, type: :job do
  let_it_be(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single.zip") }

  let_it_be(:ingestion, refind: true) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }

  before do
    ingestion.process!(ingestion.creator)
  end

  it "runs without issue" do
    expect do
      described_class.perform_now(ingestion, ingestion.creator)
    end.to execute_safely
      .and keep_the_same(Text, :count)
      .and keep_the_same(ingestion, :processing_failed)
      .and keep_the_same(ingestion, :finished?)
      .and change(ingestion, :updated_at)
      .and change(IngestionMessage, :count).by_at_least(1)
  end
end
