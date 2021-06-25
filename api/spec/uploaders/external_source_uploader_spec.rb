require "rails_helper"
RSpec.describe ExternalSourceUploader do
  let(:attachment) { cached_external_source.reload.asset }
  let(:path) { Rails.root.join("spec", "data", "assets", "images", "publication_resource.png") }
  let(:cached_external_source) { FactoryBot.build(:cached_external_source, :png_image, asset: fixture_file_upload(path)) }
  before do
    perform_enqueued_jobs { cached_external_source.save }
  end

  it "extracts metadata" do
    expect(attachment.mime_type).to eq("image/png")
    expect(attachment.extension).to eq("png")
    expect(attachment.size).to be_instance_of(Integer)
  end
  it "stores the SHA256 hash" do
    expect(attachment.metadata["sha256"]).to be_a String
  end

  it "adds a has_asset? method to the model" do
    expect(cached_external_source.respond_to?(:has_asset?)).to be true
  end

  it "adds a has_no_asset? method to the model" do
    expect(cached_external_source.respond_to?(:has_no_asset?)).to be true
  end

  it "adds a file name method to the model" do
    expect(cached_external_source.respond_to?(:asset_file_name)).to be true
  end

  it "promotes the asset to the store" do
    expect(attachment.storage_key).to eq(:store)
  end
end
