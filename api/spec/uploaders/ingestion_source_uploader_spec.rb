require "rails_helper"
RSpec.describe IngestionSourceUploader do
  let(:attachment) { ingestion_source.reload.attachment }
  let(:path) { Rails.root.join("spec", "data", "assets", "images", "publication_resource.png") }
  let(:ingestion_source) { FactoryBot.build(:ingestion_source, attachment: fixture_file_upload(path)) }

  before do
    perform_enqueued_jobs { ingestion_source.save }
  end

  it "extracts metadata" do
    expect(attachment.mime_type).to eq("image/png")
    expect(attachment.extension).to eq("png")
    expect(attachment.size).to be_instance_of(Integer)
  end

  it "assigns an ID to the attachment" do
    expect(attachment.id).to be_a String
  end

  it "promotes the asset to the store" do
    expect(attachment.storage_key).to eq(:store)
  end
end
