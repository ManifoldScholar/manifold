require "rails_helper"
RSpec.describe IngestionUploader do
  let(:attachment) { ingestion.reload.source }
  let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2.zip") }
  let(:ingestion) { FactoryBot.build(:ingestion, source: fixture_file_upload(path)) }
  before do
    perform_enqueued_jobs { ingestion.save }
  end

  it "extracts metadata" do
    expect(attachment.mime_type).to eq("application/zip")
    expect(attachment.extension).to eq("zip")
    expect(attachment.size).to be_instance_of(Integer)
  end

  it "assigns an ID to the attachment" do
    expect(attachment.id).to be_a String
  end

  it "promotes the asset to the store" do
    expect(attachment.storage_key).to eq(:store)
  end

  it "adds a file name method to the model" do
    expect(ingestion.respond_to?(:source_file_name)).to be true
  end
end
