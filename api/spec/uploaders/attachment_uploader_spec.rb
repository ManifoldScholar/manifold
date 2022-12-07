# frozen_string_literal: true

RSpec.describe AttachmentUploader do
  let_it_be(:path) { Rails.root.join("spec", "data", "assets", "images", "test_avatar.jpg") }
  let_it_be(:project, refind: true) do
    perform_enqueued_jobs do
      FactoryBot.create(:project, avatar: fixture_file_upload(path))
    end
  end

  let(:attachment) { project.reload.avatar }

  it "extracts metadata", :aggregate_failures do
    expect(attachment.mime_type).to eq("image/jpeg")
    expect(attachment.extension).to eq("jpg")
    expect(attachment.size).to be_instance_of(Integer)
    expect(attachment.metadata["width"]).to be 642
    expect(attachment.metadata["height"]).to be 642
  end

  it "includes the original file" do
    expect(attachment).to be_present
  end

  it "contains all derivatives defined in Attachment::BASE_STYLES" do
    expect(project.avatar_derivatives.keys).to include :small, :medium, :small_square, :medium_square, :small_portrait, :large_landscape, :medium_portrait, :small_landscape, :medium_landscape
  end

  it "stores dimensions for variants", :aggregate_failures do
    expect(project.avatar(:medium).metadata["width"]).to be 640
    expect(project.avatar(:medium).metadata["height"]).to be 640
  end

  it "promotes the asset to the store" do
    expect(attachment.storage_key).to eq(:store)
  end

  it "adds a configuration method to the model" do
    expect(project).to respond_to :avatar_configuration
  end

  it "adds a style_keys method to the model" do
    expect(project).to respond_to :avatar_style_keys
  end

  context "when fetching from a remote URL" do
    let_it_be(:avatar_remote_url) { "https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png" }
    let_it_be(:stubbed_png) { Rails.root.join("spec", "data", "assets", "images", "1x1.png") }
    let_it_be(:project, refind: true) do
      stub_request(:get, avatar_remote_url).to_return(
        status: 200,
        body: stubbed_png.binread,
        headers: { "content-type" => "image/png" }
      )

      perform_enqueued_jobs do
        FactoryBot.create(:project, avatar_remote_url: avatar_remote_url)
      end
    end

    it "is stored correctly", :aggregate_failures do
      expect(attachment.storage_key).to eq(:store)
      expect(attachment.size).to be 95
    end
  end
end
