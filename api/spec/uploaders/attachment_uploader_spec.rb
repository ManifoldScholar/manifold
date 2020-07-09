require "rails_helper"
RSpec.describe AttachmentUploader do
  let(:attachment) { project.reload.avatar }
  let(:path) { Rails.root.join("spec", "data", "assets", "images", "test_avatar.jpg") }
  let(:project) { FactoryBot.build(:project, avatar: fixture_file_upload(path)) }

  before do
    png_path = Rails.root.join("spec", "data", "assets", "images", "1x1.png")
    url = "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png"
    stub_request(:get, url).to_return(
      status: 200,
      body: File.read(png_path),
      headers: { "content-type" => "image/png" }
    )
    perform_enqueued_jobs { project.save }
  end

  it "extracts metadata" do
    expect(attachment[:original].mime_type).to eq("image/jpeg")
    expect(attachment[:original].extension).to eq("jpg")
    expect(attachment[:original].size).to be_instance_of(Integer)
  end

  it "includes the original file" do
    expect(attachment.key?(:original)).to be true
  end

  it "contains all variants defined in Attachment::BASE_STYLES" do
    expect(attachment.keys - [:original] && Attachments::BASE_STYLES.keys == Attachments::BASE_STYLES.keys).to be true
  end

  it "stores dimensions for the original" do
    expect(attachment[:original].metadata["width"]).to be 642
    expect(attachment[:original].metadata["height"]).to be 642
  end

  it "stores dimensions for variants" do
    expect(attachment[:medium].metadata["width"]).to be 640
    expect(attachment[:medium].metadata["height"]).to be 640
  end

  context "when fetching from a remote URL" do
    let(:project) { FactoryBot.build(:project, avatar_remote_url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png") }

    it "is stored correctly" do
      expect(attachment[:original].storage_key).to eq("store")
      expect(attachment[:original].size).to be 95
    end
  end

  it "promotes the asset to the store" do
    expect(attachment[:original].storage_key).to eq("store")
  end

end
