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
    # TODO: This reload probably shouldn't be necessary?
    perform_enqueued_jobs { project.save && project.reload }
  end

  it "extracts metadata" do
    expect(attachment.mime_type).to eq("image/jpeg")
    expect(attachment.extension).to eq("jpg")
    expect(attachment.size).to be_instance_of(Integer)
  end

  it "includes the original file" do
    expect(attachment.present?).to be true
  end

  it "contains all derivatives defined in Attachment::BASE_STYLES" do
    expect(project.avatar_derivatives.keys).to include :small, :medium, :small_square, :medium_square, :small_portrait, :large_landscape, :medium_portrait, :small_landscape, :medium_landscape
  end

  it "stores dimensions for the original" do
    expect(attachment.metadata["width"]).to be 642
    expect(attachment.metadata["height"]).to be 642
  end

  it "stores dimensions for variants" do
    expect(project.avatar(:medium).metadata["width"]).to be 640
    expect(project.avatar(:medium).metadata["height"]).to be 640
  end

  context "when fetching from a remote URL" do
    let(:project) { FactoryBot.build(:project, avatar_remote_url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png") }

    it "is stored correctly" do
      expect(attachment.storage_key).to eq(:store)
      expect(attachment.size).to be 95
    end
  end

  it "promotes the asset to the store" do
    expect(attachment.storage_key).to eq(:store)
  end

  it "adds a configuration method to the model" do
    expect(project.respond_to?(:avatar_configuration)).to be true
  end

  it "adds a style_keys method to the model" do
    expect(project.respond_to?(:avatar_style_keys)).to be true
  end
end
